---
title: "Connecting AI Agents to the Real World: APIs, Databases, and File Systems"
date: "2026-03-24"
description: "A practical guide to tool and function calling for AI agents — from safe file system access to database queries to sandboxed execution, with a look at the emerging MCP protocol."
slug: "ai-agent-tool-integration"
published: true
tags: ["AI/ML", "Agents", "Integration"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000"
---

An AI agent that can only produce text is a glorified autocomplete. The real leverage comes when agents can take actions: read files, query databases, call APIs, run code. In the Agentic SDLC project, tools were what made the system actually useful — an agent that could read the existing codebase, write new files, run tests, and verify the output was doing real engineering work, not just generating text that looked like engineering work.

This post covers the patterns I've used for tool integration, the security traps I've fallen into, and a look at the Model Context Protocol (MCP) that's changing how this all works.

## Function Calling: The Foundation

Modern LLMs support function calling natively. You declare a tool schema, and the model decides when to invoke it and with what arguments. The OpenAI function calling format is now the de facto standard:

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read the contents of a file at the given path. Use this to inspect existing code before making modifications.",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "Relative path to the file from the project root"
                    }
                },
                "required": ["path"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="gpt-4-turbo",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)
```

When the model wants to call a tool, it returns a `tool_calls` object instead of regular content. Your code executes the function, returns the result, and the model continues reasoning with that new information in context.

```python
def handle_tool_calls(response, messages):
    tool_calls = response.choices[0].message.tool_calls
    if not tool_calls:
        return response.choices[0].message.content
    
    # Add the assistant's tool call message to history
    messages.append(response.choices[0].message)
    
    for call in tool_calls:
        result = execute_tool(call.function.name, json.loads(call.function.arguments))
        messages.append({
            "role": "tool",
            "tool_call_id": call.id,
            "content": str(result)
        })
    
    # Continue the conversation with tool results
    return client.chat.completions.create(
        model="gpt-4-turbo",
        messages=messages,
        tools=tools
    )
```

## File System Tools: Safe Boundaries First

File system access is powerful and dangerous. In Agentic SDLC, agents could read any file in the project and write to designated output directories. The critical safety rule: **always validate paths against an allowed root before execution**.

```python
import os
from pathlib import Path

PROJECT_ROOT = Path("/workspace/project").resolve()
OUTPUT_DIR = Path("/workspace/output").resolve()

def safe_read_file(path: str) -> str:
    resolved = (PROJECT_ROOT / path).resolve()
    
    # Prevent path traversal attacks
    if not str(resolved).startswith(str(PROJECT_ROOT)):
        raise PermissionError(f"Path traversal detected: {path}")
    
    if not resolved.exists():
        return f"File not found: {path}"
    
    if resolved.stat().st_size > 100_000:  # 100KB limit
        return f"File too large to read directly. Size: {resolved.stat().st_size} bytes"
    
    return resolved.read_text(encoding="utf-8")

def safe_write_file(path: str, content: str) -> str:
    resolved = (OUTPUT_DIR / path).resolve()
    
    # Only allow writes to output directory
    if not str(resolved).startswith(str(OUTPUT_DIR)):
        raise PermissionError(f"Writes only allowed in output directory: {path}")
    
    resolved.parent.mkdir(parents=True, exist_ok=True)
    resolved.write_text(content, encoding="utf-8")
    return f"Written: {resolved}"
```

Path traversal (`../../etc/passwd`) is a real attack vector when user-controlled paths reach file system tools. Always resolve to an absolute path and check it's within your allowed root before proceeding.

## Database Access via Agents

Giving agents database access opens powerful capabilities — and significant risks. My approach: agents get a read-only query tool for data retrieval, and a separate write tool that validates changes through the policy engine before executing.

```python
import psycopg2
from typing import Any

def execute_read_query(sql: str, params: tuple = ()) -> list[dict]:
    """Execute a SELECT query and return results as a list of dicts."""
    # Validate it's a read-only query
    normalized = sql.strip().upper()
    if not normalized.startswith("SELECT"):
        raise ValueError("Only SELECT queries allowed through read tool")
    
    # Further: block queries that touch sensitive tables
    BLOCKED_TABLES = ["users", "payments", "secrets"]
    for table in BLOCKED_TABLES:
        if table.upper() in normalized:
            raise PermissionError(f"Table '{table}' is restricted from agent access")
    
    with get_db_connection() as conn:
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(sql, params)
        return [dict(row) for row in cursor.fetchall()]
```

I also set a query timeout and row limit. An agent in a reasoning loop might accidentally run a full table scan that kills your database.

## Sandboxed Code Execution

The most powerful tool in Agentic SDLC was also the most dangerous: code execution. Agents could run generated code to verify it works. Running untrusted LLM-generated code requires sandboxing.

My implementation uses Docker containers as execution sandboxes:

```python
import docker
import tempfile

def execute_code_sandboxed(code: str, language: str = "python") -> dict:
    client = docker.from_env()
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        temp_path = f.name
    
    try:
        container = client.containers.run(
            image="python:3.11-slim",
            command=f"python /code/script.py",
            volumes={temp_path: {"bind": "/code/script.py", "mode": "ro"}},
            network_disabled=True,      # No network access
            mem_limit="128m",           # Memory limit
            cpu_period=100000,
            cpu_quota=50000,            # 50% CPU
            timeout=30,                 # 30 second timeout
            remove=True,
            stdout=True,
            stderr=True
        )
        return {"success": True, "output": container.decode("utf-8")}
    except docker.errors.ContainerError as e:
        return {"success": False, "error": str(e)}
    finally:
        os.unlink(temp_path)
```

Never run LLM-generated code directly in your host process. Even well-intentioned agents can generate code with side effects you didn't anticipate. Containers give you isolation, resource limits, and network control.

## Security Considerations

A few hard-won lessons:

**Treat tool inputs as untrusted user input.** An LLM can be prompted (intentionally or through prompt injection in retrieved content) to produce malicious tool arguments. Validate everything.

**Principle of least privilege.** Give each agent only the tools it needs for its role. A requirements analyst has no business with file write tools. Narrowing tool access reduces the blast radius of a misbehaving agent.

**Log all tool invocations.** Every tool call should be logged with the trace ID, arguments, and result. This is your audit trail. In production Agentic SDLC, tool call logs were the primary debugging tool.

**Rate limit aggressively.** An agent in a bad loop can call a tool thousands of times in minutes. Set per-agent tool call limits per workflow execution.

## The MCP Protocol: A Glimpse at the Future

The Model Context Protocol (MCP), introduced by Anthropic, is standardizing how AI agents connect to external tools and data sources. Instead of every developer writing custom tool integration code, MCP defines a protocol: a server exposes capabilities (tools, resources, prompts), and any MCP-compatible client (Claude, a custom agent, an IDE) can discover and use them.

```json
{
  "tools": [
    {
      "name": "query_database",
      "description": "Execute a read-only SQL query against the project database",
      "inputSchema": {
        "type": "object",
        "properties": {
          "sql": { "type": "string" }
        }
      }
    }
  ]
}
```

The implications are significant. Your database tool, file system tool, and API integrations become reusable MCP servers. Any agent can connect to them using a standard protocol. We're moving from bespoke tool integration to a standardized ecosystem — the same shift that REST brought to web APIs.

I've started building the Agentic SDLC tooling as MCP servers. The investment pays off immediately: the same tools work with Claude Desktop, custom Python agents, and VS Code extensions without any additional integration work.

Tool integration is where AI agents go from interesting demos to genuinely useful systems. Build your tool layer carefully, security-first, and you'll have a foundation that can support whatever agent architecture you build on top.
