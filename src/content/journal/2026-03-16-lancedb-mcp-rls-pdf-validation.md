---
title: "LanceDB Integration, MCP for Antigravity, PostgreSQL RLS, and PDF Validation"
date: 2026-03-16
type: "day"
summary: "Deep dive into LanceDB for source indexing, MCP integration with Antigravity, PostgreSQL Row Level Security, and comprehensive PDF validation strategies."
tags: ["LanceDB", "MCP", "Antigravity", "PostgreSQL", "RLS", "PDF", "File Validation", "Security"]
---

Today focused on vector database integration, AI agent protocols, database security, and file validation systems.

## What I did

### 1. LanceDB Integration for Source Indexing

Explored integrating **LanceDB** as a vector database to index source code and optimize context retrieval.

**Key learnings:**
- **LanceDB** is an open-source vector database optimized for AI/ML workloads
- Stores embeddings alongside data in **Parquet format** for efficient columnar operations
- Supports **disk-based storage** - no need to load entire dataset into memory
- Native integration with **Python, Node.js, and Rust** ecosystems

**Integration plan with Antigravity:**
- Index codebase embeddings for semantic search
- Enable context-aware queries across the entire project
- Reduce token costs by retrieving only relevant context
- Cache frequently accessed embeddings for faster retrieval

**Benefits:**
- Faster context retrieval vs. full-codebase prompts
- Semantic search capabilities (find by meaning, not keywords)
- Cost optimization through targeted context injection

### 2. MCP (Model Context Protocol) Integration

Investigated integrating **MCP** into the Antigravity AI agent system.

**What MCP provides:**
- Standardized protocol for AI models to interact with external tools/data
- Secure sandboxing for tool execution
- Unified interface for multiple data sources (files, databases, APIs)
- Built-in authentication and permission management

**Integration approach:**
- Set up MCP server for local file system access
- Configure database connectors via MCP
- Enable Antigravity to query indexed sources through MCP
- Implement custom tools for project-specific operations

**Security considerations:**
- Define strict permission boundaries
- Audit all tool invocations
- Rate limiting to prevent abuse

### 3. PostgreSQL Row Level Security (RLS)

Deep dive into **RLS** for fine-grained access control in PostgreSQL.

**Core concepts:**
- **Row-level policies** - Control which rows users can access
- **Policy types:** `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `ALL`
- **Context-aware** - Policies can use `current_user`, `current_setting()`, JWT claims
- **Performance** - Policies are pushed down into query execution

**Policy examples:**
```sql
-- Users can only see their own data
CREATE POLICY user_isolation ON users
  FOR SELECT
  USING (auth_uid() = user_id);

-- Multi-tenant isolation
CREATE POLICY tenant_isolation ON orders
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- Role-based access
CREATE POLICY admin_full_access ON sensitive_data
  FOR ALL
  USING (current_role() = 'admin');
```

**Best practices:**
- Always enable RLS: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Create policies for ALL operations (not just SELECT)
- Use `FORCE ROW LEVEL SECURITY` for superuser bypass prevention
- Test policies with different user contexts
- Monitor policy performance with `EXPLAIN ANALYZE`

**Use cases:**
- Multi-tenant SaaS applications
- User data isolation
- Compliance requirements (GDPR, HIPAA)
- Audit trail enforcement

### 4. PDF Processing and Validation

Comprehensive study of PDF file handling and validation strategies.

**PDF structure understanding:**
- **Header** - `%PDF-1.x` version declaration
- **Body** - Objects (pages, fonts, images, annotations)
- **Cross-reference table** - Object offsets for random access
- **Trailer** - Root object pointer and metadata

**Validation approaches:**

#### A. Structural Validation
```javascript
// Check PDF header
const isValidHeader = buffer.startsWith('%PDF-');

// Verify EOF marker
const hasValidEOF = buffer.endsWith('%%EOF');

// Parse cross-reference table
const xrefValid = validateXrefTable(buffer);
```

#### B. Content Validation
- **Malware scanning** - Check for embedded scripts, JavaScript actions
- **Object count limits** - Prevent DoS via excessive objects
- **Font validation** - Detect corrupted or malicious fonts
- **Image sanitization** - Validate embedded images

#### C. Metadata Validation
```javascript
const metadata = {
  title: pdf.info?.Title,
  author: pdf.info?.Author,
  creator: pdf.info?.Creator,
  producer: pdf.info?.Producer,
  creationDate: pdf.info?.CreationDate,
};
// Validate against expected patterns
```

**Validation use cases:**

| Use Case | Validation Strategy |
|----------|---------------------|
| File upload | Header + EOF + size limits |
| Document processing | Full structural parse + malware scan |
| Compliance/Archival | PDF/A conformance validation |
| Digital signatures | Signature chain verification |
| Data extraction | Content stream validation |

**Tools and libraries:**
- **pdf-lib** - PDF manipulation and validation
- **pdfjs-dist** - Mozilla's PDF.js for parsing
- **qpdf** - CLI tool for structural repair
- **pikepdf** - Python library for validation
- **ClamAV** - Malware scanning

**Security considerations:**
- Never trust PDF metadata
- Sanitize before processing
- Run in sandboxed environment
- Implement file size limits
- Block JavaScript-enabled PDFs if not needed

## Challenges & Solutions

**Challenge:** LanceDB integration complexity with existing Antigravity workflow
**Solution:** Start with standalone indexing service, then integrate via MCP protocol

**Challenge:** RLS policy debugging is difficult
**Solution:** Use `pg_stat_statements` and detailed logging to trace policy evaluation

**Challenge:** PDF validation false positives
**Solution:** Multi-layer validation - quick checks first, deep validation only when needed

## Result

- LanceDB integration plan documented for Antigravity
- MCP server configuration drafted
- PostgreSQL RLS policies understood and ready to implement
- PDF validation framework designed with multiple strategies
- Security-first approach established for file handling

---
"Security is not a feature—it's a foundation. RLS, validation, and sandboxing are non-negotiable."
