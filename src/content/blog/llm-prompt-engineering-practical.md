---
title: "Practical Prompt Engineering Patterns for Production LLM Systems"
date: "2026-03-24"
description: "The prompt engineering techniques I actually use in production — chain-of-thought, few-shot, structured output, and how to handle hallucinations and balance cost against quality."
slug: "llm-prompt-engineering-practical"
published: true
tags: ["AI/ML", "LLMs", "Prompt Engineering"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?auto=format&fit=crop&q=80&w=1000"
---

Prompt engineering has a bad reputation in some engineering circles — it sounds like voodoo, like you're just tweaking magic words until the AI does what you want. After building the Agentic SDLC project and working extensively with both OpenAI and Anthropic APIs in production, my view is different. Prompt engineering is interface design for language models. The principles are learnable, the patterns are repeatable, and the difference between a good and bad prompt is often the difference between a reliable feature and a flaky one.

Here are the patterns I actually use, with examples from Agentic SDLC.

## System Prompts: Set the Stage Once

The system prompt is your most powerful tool and the most underused. Many developers put all their instructions in the user message and leave the system prompt as a generic "You are a helpful assistant." That's a missed opportunity.

In Agentic SDLC, every agent has a detailed system prompt that establishes role, output format expectations, and constraints:

```python
REQUIREMENTS_ANALYST_SYSTEM = """
You are a Senior Requirements Analyst specializing in software product development.

## Your Role
- Transform vague project ideas into precise, developer-ready requirements
- Ask clarifying questions when requirements are ambiguous
- Produce structured output that development teams can act on immediately

## Output Format
Always produce requirements in this exact structure:
1. Functional requirements as numbered user stories: "As a [user], I want [feature] so that [benefit]"
2. Non-functional requirements with measurable acceptance criteria
3. Open questions — list anything that needs clarification before development starts

## Constraints
- Never invent requirements that weren't implied by the brief
- If something is unclear, mark it as an open question instead of assuming
- Keep requirements atomic — one requirement, one acceptance criterion

## Quality Bar
A good requirement is: specific, measurable, achievable, and testable.
"""
```

Notice what this system prompt does: it defines role, output structure, constraints, and quality criteria. The model now has a clear mental framework before seeing any user input. This dramatically reduces variance in outputs.

## Chain-of-Thought: Show Your Work

Chain-of-thought (CoT) prompting — asking the model to reason step by step before giving a final answer — consistently improves output quality for complex tasks. The key insight is that LLMs are better at each individual reasoning step than they are at jumping directly to a complex conclusion.

In the Agentic SDLC architecture design agent, I prompt explicitly for CoT:

```python
ARCHITECTURE_USER_TEMPLATE = """
Given these requirements: {requirements}

Think through the architecture step by step:
1. What are the core domain entities and their relationships?
2. What are the main system components needed?
3. What are the integration points and data flows between them?
4. What are the technology trade-offs for each major component?
5. What are the top 3 risks in this architecture?

After your analysis, produce the final Architecture Decision Record.
"""
```

The numbered reasoning steps force the model to work through the problem systematically before committing to a final answer. For complex tasks, this is the single biggest quality improvement I've found. The tradeoff is token cost — you're generating more output. For architecture decisions, the cost is worth it; for simple classification tasks, it's overkill.

## Few-Shot Examples: Show Don't Tell

For tasks with a specific output format, nothing beats showing the model exactly what you want with 2-3 examples. In Agentic SDLC, I used few-shot prompting for the code review agent because "good code review" is highly subjective without examples:

```python
CODE_REVIEW_EXAMPLES = """
Example 1:
Code: `def get_user(id): return db.query(f"SELECT * FROM users WHERE id={id}")`
Review:
- CRITICAL: SQL injection vulnerability. Never use f-strings for SQL queries.
- Fix: Use parameterized queries: `db.query("SELECT * FROM users WHERE id=?", (id,))`

Example 2:
Code: `user = get_user(user_id)\nif user != None:\n    return user.profile`
Review:
- STYLE: Use `if user is not None` instead of `!= None` (PEP 8)
- STYLE: Consider `if user:` for simpler None checks
- No critical issues.

Now review the following code and use the same format:
"""
```

The examples calibrate severity levels (CRITICAL vs STYLE), output format, and the level of specificity expected. Without examples, the model's "code review" might be vague praise or overwhelming nitpicking.

## Structured Output: JSON Mode Is Your Friend

For any agent output that will be consumed programmatically, use JSON mode (OpenAI) or structured output prompting. Don't try to parse free-form text — it will break.

```python
from openai import OpenAI
import json

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4-turbo",
    messages=[
        {
            "role": "system",
            "content": "You are a requirements analyst. Always respond with valid JSON matching the RequirementSpec schema."
        },
        {
            "role": "user", 
            "content": f"Analyze this brief: {project_brief}\n\nReturn JSON with keys: title, user_stories (array), nfrs (array), open_questions (array)"
        }
    ],
    response_format={"type": "json_object"}
)

spec = json.loads(response.choices[0].message.content)
```

Always validate the JSON against your expected schema after parsing. Even with JSON mode, the model might include unexpected fields or miss required ones. Use Pydantic for this validation — it gives you clear error messages you can feed back to the model for retry.

## Handling Hallucinations in Production

Hallucinations are a fact of LLM life. My strategies for managing them:

**Ground the model with explicit data.** When the agent needs to reference existing code or requirements, I pass the actual content in the prompt. "Based on the codebase at `/src/api/users.py`: [file contents]" is far more reliable than asking the model to recall it.

**Ask for confidence and uncertainty.** Prompt the model to flag anything it's unsure about: "If any part of your response relies on an assumption rather than explicit information provided, mark it with [ASSUMED]." This makes hallucinations visible.

**Validate outputs against ground truth.** For code generation, run the code. For schema generation, validate against the database. For requirements, check that every requirement maps back to something in the brief. Automated validation is more reliable than human review for catching hallucinations.

## Cost vs. Quality Trade-offs

Running GPT-4 for everything is quality-maxed but budget-destroying. My routing strategy in Agentic SDLC:

| Task | Model | Why |
|------|-------|-----|
| Requirements analysis | GPT-4 Turbo | Needs deep reasoning, is an upstream dependency |
| Code generation | GPT-4 Turbo | High stakes, correctness matters |
| Code review | GPT-4 Turbo | Needs to catch subtle bugs |
| Test generation | Claude Sonnet | Good at pattern matching, lower cost |
| Documentation | Claude Haiku | Simple transformation task |
| Classification/routing | GPT-3.5 Turbo | Trivial task, massive cost savings |

The rule of thumb I use: the more a task is a dependency for downstream tasks, the more I invest in quality (and cost). Mistakes in upstream agents cascade. Mistakes in documentation generation are easy to fix.

## Iteration Over Intuition

The biggest meta-lesson from prompt engineering in Agentic SDLC: treat prompts like code. Version them, test them (with the replay store I described in my Rust post), and measure quality changes. When I changed a system prompt, I'd run the test suite and compare outputs. A prompt that "feels better" isn't better until the outputs are measurably better.

Good prompt engineering is empirical, not magical. Build your feedback loop, instrument your outputs, and iterate.
