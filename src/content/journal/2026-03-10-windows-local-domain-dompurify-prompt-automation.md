---
title: "Windows Local Domain, DOMPurify Checks, Prompt Automation, and Skill Design Training"
date: 2026-03-10
type: "day"
summary: "Edited Windows hosts to fake local domains, expanded security checks with isomorphic-dompurify (URL, variables, IP, DNS), wrote a single prompt to generate checklist/commit/report/trace, and attended skill design training from basic to detail design."
tags: ["Windows", "Local Domain", "Security", "DOMPurify", "Automation", "Prompting", "Training", "Skill Design"]
---

Today was a mix of technical work and process cleanup to reduce manual overhead and improve consistency.

## What I did

1. **Edited the Windows `hosts` file to fake local domains**
- Recalled the exact `hosts` workflow and mapped local domains for testing on the machine.
- Kept the shorthand note `**config host local domain cho window**` for quick reuse.

2. **Worked with `isomorphic-dompurify` and expanded security checks**
- Added and organized checks across URL, input variables, IP, and DNS.
- Goal: detect abnormal input early at the sanitize/validate layer.

3. **Reduced the overhead of document generation**
- Generating checklist, commit message, report, and trace was too repetitive.
- Wrote a single prompt that produces all of them in one run.

4. **Training on skill design (basic -> detail design)**
- Reinforced the path from basic structure to detailed specification.
- Focused on clarifying goals, constraints, and evaluation criteria in skill design.

## Result

- Local domain mapping on Windows is stable and easy to reuse.
- `isomorphic-dompurify` checks are broader and more defense-in-depth.
- Prompt automation cuts down routine documentation work.
- Stronger mental model for skill design from basic to detail design.
