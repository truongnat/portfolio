# Content Templates Index

📚 Complete template reference for AI-generated content.

---

## 🎯 Quick Start

**For AI Agents:** Start with [`AI_AGENT_INSTRUCTIONS.md`](./AI_AGENT_INSTRUCTIONS.md)

**For Journal Entries:** Use [`TEMPLATES_JOURNAL.md`](./TEMPLATES_JOURNAL.md)

**For Blog Posts:** Use [`TEMPLATES_BLOG.md`](./TEMPLATES_BLOG.md)

**For Generation Rules:** See [`JOURNAL_RULES.md`](./JOURNAL_RULES.md)

---

## 📋 Available Templates

### Journal Templates (`TEMPLATES_JOURNAL.md`)

| Type | Frequency | When | File Pattern |
|------|-----------|------|--------------|
| 📅 Daily | Every day | End of day | `YYYY-MM-DD-slug.md` |
| 📊 Weekly | Sunday | End of week | `YYYY-MM-DD-week-range.md` |
| 📈 Monthly | 1st of month | Previous month | `YYYY-MM-DD-month-YYYY-MM.md` |
| 📉 Quarterly | 1st of Q | Previous quarter | `YYYY-MM-DD-quarter-YYYY-QN.md` |
| 📆 Yearly | Dec 31 | Full year | `YYYY-MM-DD-year-YYYY.md` |
| 🔄 Cycle | 5/10 years | Milestone years | `YYYY-MM-DD-cycle-YYYY-YYYY.md` |

### Blog Templates (`TEMPLATES_BLOG.md`)

| Type | Purpose | When | File Pattern |
|------|---------|------|--------------|
| 📖 Case Study | Real project experience | After completing project | `topic-a-practical-case-study.md` |
| 🔬 Advanced Patterns | Technical deep dive | When sharing expertise | `topic-advanced-patterns-and-best-practices.md` |
| 💭 Reflection | Personal insights | After learning experience | `topic-reflections.md` |
| 📝 Tutorial | Step-by-step guide | When teaching | `how-to-topic.md` |

---

## 📁 File Locations

```
portfolio/
├── 📄 AI_AGENT_INSTRUCTIONS.md    ← Start here for AI usage
├── 📄 TEMPLATES_JOURNAL.md        ← Journal entry templates
├── 📄 TEMPLATES_BLOG.md           ← Blog post templates
├── 📄 JOURNAL_RULES.md            ← Generation schedule & rules
├── 📄 CONTENT_TEMPLATES.md        ← This file (index)
│
├── src/content/
│   ├── journal/                   ← Daily logs & summaries
│   └── blog/                      ← Blog posts
│
└── scripts/
    └── generate-journal-summaries.ts
```

---

## ✅ Content Checklist

### Before Publishing

- [ ] Correct template used
- [ ] All frontmatter fields filled
- [ ] English language throughout
- [ ] Proper file naming
- [ ] Tags are relevant (3-6 for journal, 2-4 for blog)
- [ ] Code examples have language specified
- [ ] Links are properly formatted
- [ ] Build passes: `bun run build`

### Journal Specific
- [ ] Date in filename matches content date
- [ ] Type matches template (day/week/month/quarter/year/cycle)
- [ ] Summary is 1-2 sentences

### Blog Specific
- [ ] Slug matches filename
- [ ] Description is compelling (1-2 sentences)
- [ ] Cover image URL is valid
- [ ] Published status is correct

---

## 🚀 Quick Commands

```bash
# Development
bun run dev                    # Start dev server
bun run build                  # Build project
bun run preview                # Preview build

# Journal Generation
bun run journal:summary        # Auto-generate all summaries
bun run journal:summary:force-week    # Force weekly summary
bun run journal:summary:force-month   # Force monthly summary

# Code Quality
bun run lint                   # Check code
bun run lint:fix              # Fix issues
```

---

## 📖 Template Summaries

### Daily Journal Structure
```markdown
---
title: "Descriptive Title"
date: YYYY-MM-DD
type: "day"
summary: "1-2 sentence summary"
tags: ["Tag1", "Tag2", "Tag3"]
---

Today focused on [main theme].

## What I did
### 1. [Topic]
[Description]

## Challenges & Solutions
**Challenge:** [Description]
**Solution:** [Resolution]

## Result
- [Outcome 1]
- [Outcome 2]

---
"[Key learning]"
```

### Weekly Summary Structure
```markdown
---
title: "Week Summary (YYYY-MM-DD -> YYYY-MM-DD)"
date: YYYY-MM-DD
type: "week"
summary: "Weekly summary covering X daily logs."
tags: ["Week", "Summary", "TopTag1", "TopTag2"]
---

## Scope
- Period: `YYYY-MM-DD -> YYYY-MM-DD`
- Total daily logs: **X**

## Highlights
- **YYYY-MM-DD**: [Title]

## Key Themes
- #Tag1
- #Tag2

## Key Learnings
1. **Learning**: Description

## Next Focus
- [Goal 1]
- [Goal 2]
```

### Blog Case Study Structure
```markdown
---
title: "Topic: A Practical Case Study"
date: "YYYY-MM-DD"
description: "Challenge and outcome description"
slug: "topic-a-practical-case-study"
tags: ["Category", "Technology"]
---

# Title

## The Challenge
- **Constraint:** [Limitation]
- **Goal:** [Objective]

## The Solution
### 1. [Component]
[Explanation + code]

## Results
| Metric | Before | After |
|--------|--------|-------|
| [Name] | Value  | Value |

## Conclusion
[Takeaway]
```

---

## 🎯 Best Practices

### Writing
- Be clear and concise
- Use active voice
- Include specific examples
- Add metrics where possible
- Keep paragraphs short (2-4 sentences)

### Code
- Always specify language
- Keep examples minimal
- Add comments for complex parts
- Show complete, runnable code

### Formatting
- Use headers hierarchically
- Include tables for comparisons
- Use bold for emphasis
- Use lists for multiple items

### Tags
- Be consistent with existing tags
- Mix broad and specific tags
- Capitalize each word
- Limit to relevant tags (3-6 journal, 2-4 blog)

---

## 📞 Need Help?

1. **Check template file** for exact format
2. **Review existing content** for examples
3. **See AI_AGENT_INSTRUCTIONS.md** for workflows
4. **Ask user** for clarification when needed

---

## 🔄 Updates

This template system was created on 2026-03-14.

For questions or updates, refer to the main documentation files or consult with the project maintainer.
