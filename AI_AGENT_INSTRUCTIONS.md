# AI Agent Instructions

This document provides instructions for AI agents generating content for this portfolio.

---

## Quick Reference

| Content Type | Template File | Location |
|-------------|--------------|----------|
| Journal Daily | `TEMPLATES_JOURNAL.md` | Daily logs |
| Journal Weekly | `TEMPLATES_JOURNAL.md` | Week summaries |
| Journal Monthly | `TEMPLATES_JOURNAL.md` | Month summaries |
| Journal Quarterly | `TEMPLATES_JOURNAL.md` | Quarter summaries |
| Journal Yearly | `TEMPLATES_JOURNAL.md` | Year summaries |
| Blog Case Study | `TEMPLATES_BLOG.md` | Practical experiences |
| Blog Advanced | `TEMPLATES_BLOG.md` | Technical deep dives |
| Blog Reflection | `TEMPLATES_BLOG.md` | Personal insights |
| Blog Tutorial | `TEMPLATES_BLOG.md` | How-to guides |

---

## Core Rules

### 1. Language
- **All content must be in English**
- Technical terms remain in English
- Proper nouns (names, tools) stay as-is

### 2. File Naming
- **Journal**: `YYYY-MM-DD-type-slug.md`
- **Blog**: `topic-descriptor.md`
- Always use kebab-case
- Include date in journal files

### 3. Frontmatter
- Follow schema exactly as defined in templates
- All required fields must be present
- Use proper YAML syntax

### 4. Formatting
- Consistent header hierarchy (`##`, `###`, `####`)
- Proper markdown syntax
- Code blocks with language specification
- Tables for comparisons

---

## Journal Generation Workflow

### For Daily Logs
1. Ask user: "What did you work on today?"
2. Identify key topics and outcomes
3. Use **Daily Log Template**
4. Extract 3-6 relevant tags
5. Write 1-2 sentence summary
6. Save to `src/content/journal/YYYY-MM-DD-slug.md`

### For Weekly Summaries
1. Run: `bun run journal:summary`
2. Or manually use **Weekly Summary Template**
3. Aggregate daily logs from the week
4. Identify top themes (3-4 tags)
5. Extract key learnings
6. Save to `src/content/journal/YYYY-MM-DD-week-range.md`

### For Monthly/Quarterly/Yearly
1. Use respective template from `TEMPLATES_JOURNAL.md`
2. Aggregate from lower-level summaries
3. Follow generation schedule in `JOURNAL_RULES.md`

---

## Blog Generation Workflow

### Step 1: Identify Content Type
Ask user:
- "Is this based on a real project experience?" → Case Study
- "Is this a technical deep dive?" → Advanced Patterns
- "Is this personal learning/reflection?" → Reflection
- "Is this a step-by-step guide?" → Tutorial

### Step 2: Gather Information
For **Case Study**:
- What was the challenge?
- What constraints existed?
- What solution was implemented?
- What were the results/metrics?

For **Advanced Patterns**:
- What patterns to cover?
- What are the use cases?
- What are common pitfalls?

For **Reflection**:
- What triggered this thinking?
- What were key insights?
- What actions will result?

For **Tutorial**:
- What will readers learn?
- What are prerequisites?
- What are the steps?

### Step 3: Generate Content
1. Use appropriate template from `TEMPLATES_BLOG.md`
2. Follow frontmatter schema
3. Include code examples where relevant
4. Add tables for comparisons
5. Write clear section headers

### Step 4: Review
- Check all required frontmatter fields
- Verify markdown syntax
- Ensure consistent formatting
- Validate slug matches filename

---

## Tag Guidelines

### Journal Tags
- Use 3-6 tags per entry
- Capitalize each word
- Mix of broad and specific
- Examples: `["AI", "Security", "Database", "RLS"]`

### Blog Tags
- Use 2-4 tags per post
- Align with existing categories
- Examples: `["AI/ML", "LLMs", "Case Study"]`

### Common Tag Categories
- **Technologies**: `TypeScript`, `React`, `Node.js`, `AI`
- **Domains**: `Security`, `Database`, `DevOps`, `Mobile`
- **Content Types**: `Case Study`, `Tutorial`, `Reflection`
- **Skills**: `Architecture`, `Testing`, `Performance`

---

## Code Example Guidelines

### Format
```typescript
// Always specify language
// Add comments for complex logic
function example() {
  return "clear and readable";
}
```

### Best Practices
- Keep examples minimal and focused
- Show complete, runnable code when possible
- Include both good and bad examples for contrast
- Use meaningful variable names

---

## Image Guidelines

### Unsplash URLs
```
https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&q=80&w=1000
```

### Parameters
- `auto=format` - Auto format selection
- `fit=crop` - Crop to fit
- `q=80` - Quality 80%
- `w=1000` - Width 1000px

### Selection
- Choose relevant images
- Professional and clean
- Match content theme
- Avoid distracting visuals

---

## Quality Checklist

Before finalizing any content:

- [ ] All frontmatter fields present and correct
- [ ] Language is English throughout
- [ ] File naming follows convention
- [ ] Headers are properly hierarchical
- [ ] Code blocks have language specified
- [ ] Links are properly formatted
- [ ] Tags are relevant and consistent
- [ ] Summary/description is clear
- [ ] Content adds value
- [ ] No placeholder text remaining

---

## Version Control

### Commit Messages
```
docs: Add journal entry for YYYY-MM-DD [topic]
docs: Add blog post about [topic]
docs: Update weekly summary for week YYYY-MM-DD
```

### Git Workflow
1. Create content file
2. Build project: `bun run build`
3. Verify locally: `bun run preview`
4. Commit with descriptive message
5. Push to main branch

---

## Commands Reference

```bash
# Development
bun run dev                    # Start dev server
bun run build                  # Build for production
bun run preview                # Preview production build

# Journal Generation
bun run journal:summary        # Auto-generate summaries
bun run journal:summary:force-week    # Force weekly
bun run journal:summary:force-month   # Force monthly
bun run journal:summary:force-quarter # Force quarterly
bun run journal:summary:force-year    # Force yearly

# Code Quality
bun run lint                   # Run ESLint
bun run lint:fix              # Fix ESLint issues
```

---

## File Structure

```
portfolio/
├── src/
│   ├── content/
│   │   ├── blog/           # Blog posts
│   │   └── journal/        # Journal entries
│   ├── pages/
│   │   ├── blog/
│   │   └── journal/
│   └── components/
├── scripts/
│   └── generate-journal-summaries.ts
├── TEMPLATES_JOURNAL.md    # Journal templates
├── TEMPLATES_BLOG.md       # Blog templates
├── JOURNAL_RULES.md        # Generation rules
└── AI_AGENT_INSTRUCTIONS.md # This file
```

---

## Help & Support

If unsure about anything:
1. Check relevant template file
2. Review existing similar content
3. Ask user for clarification
4. Refer to `JOURNAL_RULES.md` for schedules

---

## Template Locations

- **Journal Templates**: `TEMPLATES_JOURNAL.md`
- **Blog Templates**: `TEMPLATES_BLOG.md`
- **Generation Rules**: `JOURNAL_RULES.md`

Always use these templates to ensure consistency across all generated content.
