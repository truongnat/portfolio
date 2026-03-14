# Journal Entry Templates

Use these templates when creating journal entries via AI agents.

---

## Daily Log Template

**File:** `src/content/journal/YYYY-MM-DD-short-slug.md`

```markdown
---
title: "Descriptive Title in English"
date: YYYY-MM-DD
type: "day"
summary: "Brief 1-2 sentence summary in English"
tags: ["Tag1", "Tag2", "Tag3"]
---

Today focused on [main theme] with [key outcome].

## What I did

### 1. [Topic/Area]
[Description of what was done]

**Key points:**
- Point 1
- Point 2
- Point 3

### 2. [Topic/Area]
[Description of what was done]

## Challenges & Solutions

**Challenge:** [Description]
**Solution:** [How it was resolved]

## Result

- [Outcome 1]
- [Outcome 2]
- [Outcome 3]

---
"[Key learning or quote of the day]"
```

### Daily Log Example

```markdown
---
title: "Version Management Discipline, Hidden Test Cases, and Apple Store Deployment"
date: 2026-03-12
type: "day"
summary: "Lessons on version management discipline, strategies for finding hidden test cases, and temporary fixes to deploy the app to Apple Store."
tags: ["Version Management", "Testing", "iOS", "Deployment", "Apple Store", "Debugging"]
---

Today focused on version control discipline, test coverage gaps, and getting the app shipped to Apple Store.

## What I did

### 1. Version Management Discipline

A critical reminder: **Version management is not optional—it's discipline.**

Key principles:
- **Every version upgrade must have a reason** - No "just because it's latest" upgrades
- **Synchronization is mandatory** - All dependencies must be compatible across the stack
- **Check lock files** - Always verify `package-lock.json`, `bun.lock`, `yarn.lock`, etc.
- **Prevent conflicts early** - Version mismatches cause cascading failures

**Lesson:** Sloppy version management = technical debt compound interest.

### 2. Finding Hidden Test Cases

Strategies I used:
- **Edge case mapping** - Think through unusual user flows
- **Platform-specific behavior** - iOS/Android often have different expectations
- **Review rejection guidelines** - Apple's guidelines hint at common failure cases
- **Log analysis** - Check crash reports and error patterns

## Challenges & Solutions

**Challenge:** App Store rejection due to undiscovered edge cases
**Solution:** Implemented systematic test case discovery process and patched critical issues

## Result

- App deployed to Apple Store ✓
- Version management discipline reinforced
- Test case discovery process documented

---
"Version discipline is engineering discipline. Hidden tests will find you—find them first."
```

---

## Weekly Summary Template

**File:** `src/content/journal/YYYY-MM-DD-week-YYYY-MM-DD_to_YYYY-MM-DD.md`

```markdown
---
title: "Week Summary (YYYY-MM-DD -> YYYY-MM-DD)"
date: YYYY-MM-DD
type: "week"
summary: "Weekly summary covering X daily logs from YYYY-MM-DD to YYYY-MM-DD. Focus areas: [area1], [area2], [area3]."
tags: ["Week", "Summary", "TopTag1", "TopTag2", "TopTag3"]
---

## Scope

- Period: `YYYY-MM-DD -> YYYY-MM-DD`
- Total daily logs: **X**
- [Optional: Special notes about this period]

## Highlights

- **YYYY-MM-DD**: [Title of daily log]
- **YYYY-MM-DD**: [Title of daily log]
- **YYYY-MM-DD**: [Title of daily log]
- [Continue for all days]

## Key Themes

- #[Tag1] ([specific topics])
- #[Tag2] ([specific topics])
- #[Tag3] ([specific topics])

## Key Learnings

1. **[Learning Title]**: [Description]
2. **[Learning Title]**: [Description]
3. **[Learning Title]**: [Description]

## Metrics (Optional)

| Metric | Value | Notes |
|--------|-------|-------|
| Total entries | X | Daily logs |
| Top tag | TagName | Count |
| Blockers resolved | X | Issues solved |

## Source Logs

- [slug-1](/journal/slug-1/index.html)
- [slug-2](/journal/slug-2/index.html)
- [slug-3](/journal/slug-3/index.html)

## Next Focus

- [Goal 1]
- [Goal 2]
- [Goal 3]
```

---

## Monthly Summary Template

**File:** `src/content/journal/YYYY-MM-DD-month-YYYY-MM.md`

```markdown
---
title: "Month Summary (YYYY-MM)"
date: YYYY-MM-DD
type: "month"
summary: "Monthly summary covering X daily logs and Y weekly summaries in YYYY-MM."
tags: ["Month", "Summary", "TopTag1", "TopTag2", "TopTag3"]
---

## Scope

- Period: `YYYY-MM-01 -> YYYY-MM-DD`
- Total daily logs: **X**
- Total weekly summaries: **Y**

## Month Overview

[2-3 paragraph overview of the month's main themes and achievements]

## Weekly Breakdown

### Week 1 (YYYY-MM-DD -> YYYY-MM-DD)
- Focus: [Theme]
- Key outcome: [Result]

### Week 2 (YYYY-MM-DD -> YYYY-MM-DD)
- Focus: [Theme]
- Key outcome: [Result]

[Continue for all weeks]

## Key Achievements

1. **[Achievement 1]**: [Description]
2. **[Achievement 2]**: [Description]
3. **[Achievement 3]**: [Description]

## Key Themes

- #[Tag1] ([count] occurrences)
- #[Tag2] ([count] occurrences)
- #[Tag3] ([count] occurrences)

## Challenges Overcome

- [Challenge 1]: [How resolved]
- [Challenge 2]: [How resolved]

## Source Logs

### Weekly Summaries
- [Week 1 slug](/journal/slug/index.html)
- [Week 2 slug](/journal/slug/index.html)

### Selected Daily Logs
- [Notable day 1](/journal/slug/index.html)
- [Notable day 2](/journal/slug/index.html)

## Next Month Focus

- [Goal 1]
- [Goal 2]
- [Goal 3]
```

---

## Quarterly Summary Template

**File:** `src/content/journal/YYYY-MM-DD-quarter-YYYY-QN.md`

```markdown
---
title: "Quarterly Summary (YYYY QN)"
date: YYYY-MM-DD
type: "quarter"
summary: "Quarterly summary covering QN of YYYY with X monthly summaries and Y total logs."
tags: ["Quarter", "Summary", "TopTag1", "TopTag2", "TopTag3"]
---

## Scope

- Quarter: QN YYYY ([Month] -> [Month])
- Period: `YYYY-MM-DD -> YYYY-MM-DD`
- Total monthly summaries: **3**
- Total weekly summaries: **X**
- Total daily logs: **Y**

## Quarter Overview

[Overview of quarter's strategic focus and outcomes]

## Monthly Breakdown

### Month 1: [Month Name]
- Theme: [Monthly theme]
- Key achievement: [Result]
- Learnings: [Key takeaway]

### Month 2: [Month Name]
- Theme: [Monthly theme]
- Key achievement: [Result]
- Learnings: [Key takeaway]

### Month 3: [Month Name]
- Theme: [Monthly theme]
- Key achievement: [Result]
- Learnings: [Key takeaway]

## Strategic Achievements

1. **[Achievement]**: [Impact and metrics]
2. **[Achievement]**: [Impact and metrics]
3. **[Achievement]**: [Impact and metrics]

## Key Themes

- #[Tag1]
- #[Tag2]
- #[Tag3]

## Lessons Learned

- [Lesson 1]
- [Lesson 2]
- [Lesson 3]

## Next Quarter Goals

### Technical Goals
- [Goal 1]
- [Goal 2]

### Process Goals
- [Goal 1]
- [Goal 2]

### Learning Goals
- [Goal 1]
- [Goal 2]
```

---

## Yearly Summary Template

**File:** `src/content/journal/YYYY-MM-DD-year-YYYY.md`

```markdown
---
title: "Year Summary (YYYY)"
date: YYYY-12-31
type: "year"
summary: "Annual summary covering YYYY with X quarterly summaries, Y monthly summaries, and Z total logs."
tags: ["Year", "Summary", "TopTag1", "TopTag2", "TopTag3"]
---

## Scope

- Year: YYYY
- Period: `YYYY-01-01 -> YYYY-12-31`
- Total quarterly summaries: **4**
- Total monthly summaries: **12**
- Total weekly summaries: **52**
- Total daily logs: **X**

## Year in Review

[Comprehensive year overview - 3-5 paragraphs]

## Quarterly Highlights

### Q1 (Jan-Mar): [Theme]
- Key achievement: [Result]
- Major learning: [Insight]

### Q2 (Apr-Jun): [Theme]
- Key achievement: [Result]
- Major learning: [Insight]

### Q3 (Jul-Sep): [Theme]
- Key achievement: [Result]
- Major learning: [Insight]

### Q4 (Oct-Dec): [Theme]
- Key achievement: [Result]
- Major learning: [Insight]

## Top Achievements

1. **[Achievement]**: [Impact]
2. **[Achievement]**: [Impact]
3. **[Achievement]**: [Impact]
4. **[Achievement]**: [Impact]
5. **[Achievement]**: [Impact]

## Skill Development

### Technical Skills
- [Skill 1]: [Progress level]
- [Skill 2]: [Progress level]

### Soft Skills
- [Skill 1]: [Progress level]
- [Skill 2]: [Progress level]

## Key Themes

- #[Tag1] ([count] occurrences)
- #[Tag2] ([count] occurrences)
- #[Tag3] ([count] occurrences)

## Challenges & Growth

- **Challenge**: [Description]
  - **Response**: [Action taken]
  - **Growth**: [What was learned]

## Next Year Vision

### Technical Goals
- [Goal 1]
- [Goal 2]
- [Goal 3]

### Career Goals
- [Goal 1]
- [Goal 2]

### Personal Goals
- [Goal 1]
- [Goal 2]
```

---

## 5-Year / 10-Year Cycle Template

**File:** `src/content/journal/YYYY-MM-DD-cycle-YYYY-YYYY.md`

```markdown
---
title: "Cycle Summary (YYYY-YYYY)"
date: YYYY-MM-DD
type: "cycle"
summary: "[5/10]-year cycle summary covering YYYY to YYYY."
tags: ["Cycle", "Summary", "TopTag1", "TopTag2"]
---

## Scope

- Cycle Length: [5/10] years
- Period: `YYYY -> YYYY`
- Total yearly summaries: **[5/10]**

## Cycle Narrative

[Comprehensive narrative of the cycle - the story arc]

## Year by Year Journey

### YYYY: [Year Theme]
[Key events and outcomes]

### YYYY: [Year Theme]
[Key events and outcomes]

[Continue for all years]

## Transformation

### Beginning of Cycle
- [State at start]

### End of Cycle
- [State at end]

### Key Transformations
1. [Transformation 1]
2. [Transformation 2]
3. [Transformation 3]

## Major Achievements

- [Achievement 1]
- [Achievement 2]
- [Achievement 3]

## Lessons for Next Cycle

1. [Lesson 1]
2. [Lesson 2]
3. [Lesson 3]

## Next Cycle Vision

[Vision and direction for the next cycle]
```

---

## AI Agent Instructions

When generating journal entries:

1. **Always use English** for all content
2. **Follow the exact frontmatter schema** for each type
3. **Use appropriate template** based on entry type
4. **Maintain consistent formatting**:
   - Headers: `## Section`, `### Subsection`
   - Lists: `- Item` or `1. Item`
   - Bold: `**text**`
   - Code: `` `inline` `` or ` ```blocks``` `
   - Quotes: `"> `
5. **Tags**: Use 3-6 relevant tags, capitalize each word
6. **Summary**: 1-2 sentences, descriptive and in English
7. **File naming**: Follow the naming convention exactly
8. **Date format**: ISO 8601 (YYYY-MM-DD)
