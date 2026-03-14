# Journal Summary Generation Rules

## Overview
This document defines the rules for automatic journal summary generation.

## Summary Schedule

| Period | Generation Date | Coverage |
|--------|----------------|----------|
| **Daily** | Every day | Same day |
| **Weekly** | Sunday (end of week) | Monday → Sunday |
| **Monthly** | 1st day of month | Previous month (1st → last day) |
| **Quarterly** | 1st day of Q1, Q2, Q3, Q4 | Previous quarter |
| **Yearly** | Last day of year (Dec 31) | Full year (Jan 1 → Dec 31) |
| **5-Year Cycle** | Last day of year divisible by 5 | 5-year period |
| **10-Year Cycle** | Last day of year divisible by 10 | 10-year period |

## Week Definition
- **Week starts:** Monday
- **Week ends:** Sunday
- **ISO Week Standard:** Follows ISO 8601

## Quarterly Definition
| Quarter | Months | Summary Generated |
|---------|--------|-------------------|
| Q1 | Jan, Feb, Mar | April 1 |
| Q2 | Apr, May, Jun | July 1 |
| Q3 | Jul, Aug, Sep | October 1 |
| Q4 | Oct, Nov, Dec | January 1 (next year) |

## File Naming Convention

### Daily Logs
```
YYYY-MM-DD-short-slug.md
```
Example: `2026-03-14-weekly-review-content-sync.md`

### Weekly Summaries
```
YYYY-MM-DD-week-YYYY-MM-DD_to_YYYY-MM-DD.md
```
Example: `2026-03-16-week-2026-03-10_to_2026-03-16.md`

### Monthly Summaries
```
YYYY-MM-DD-month-YYYY-MM.md
```
Example: `2026-04-01-month-2026-03.md`

### Quarterly Summaries
```
YYYY-MM-DD-quarter-YYYY-QN.md
```
Example: `2026-04-01-quarter-2026-Q1.md`

### Yearly Summaries
```
YYYY-MM-DD-year-YYYY.md
```
Example: `2026-12-31-year-2026.md`

### Cycle Summaries
```
YYYY-MM-DD-cycle-YYYY-YYYY.md
```
Example: `2030-12-31-cycle-2026-2030.md`

## Frontmatter Schema

### Daily Entry
```yaml
---
title: "Descriptive Title"
date: YYYY-MM-DD
type: "day"
summary: "Brief summary in English (1-2 sentences)"
tags: ["Tag1", "Tag2", "Tag3"]
---
```

### Summary Entry (Week/Month/Quarter/Year/Cycle)
```yaml
---
title: "Week/Month/Quarter/Year/Cycle Summary (YYYY-MM-DD -> YYYY-MM-DD)"
date: YYYY-MM-DD
type: "week|month|quarter|year|cycle"
summary: "Summary description in English"
tags: ["Period", "Summary", "TopTag1", "TopTag2"]
---
```

## Content Language
- **All summaries must be in English**
- Daily logs can be in English or Vietnamese
- Technical terms should remain in English

## Summary Content Structure

### Required Sections
1. **Scope** - Period range and total logs count
2. **Highlights** - Key entries from the period
3. **Key Themes** - Top tags/topics
4. **Source Logs** - Links to all daily logs
5. **Next Focus** - Goals for next period

### Optional Sections
- Metrics/Stats
- Challenges & Solutions
- Learnings

## Automation Commands

```bash
# Generate all summaries automatically
bun run journal:summary

# Force generate specific period
bun run journal:summary:force-week
bun run journal:summary:force-month
bun run journal:summary:force-quarter
bun run journal:summary:force-year
```

## Manual Override
If automatic generation doesn't match needs:
1. Run with `--force --period <type>` flag
2. Manually edit the generated file
3. Update this rules document if needed

## Notes
- First weekly summary (2026-03-14) covers project start to current date
- Subsequent summaries follow the schedule above
- Keep summaries concise and actionable
