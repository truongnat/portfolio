---
title: "dotagents is a folder on purpose"
date: "2026-10-27"
description: "How the dotagents repo became a workflow and memory kit for coding agents in three days, and why retrieval is still ripgrep."
slug: "how-i-built-dotagents"
published: true
tags: ["AI/ML", "Agents", "Tooling"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1000"
---

On 24 October 2026 the first commit in [dotagents](https://github.com/truongnat/dotagents) was a directory layout with a plain name in the message: blueprint. Two days later the history was eleven commits long, and the search script still shells out to ripgrep.

I wrote it because an agent memory that records every session is a junk drawer with cleaner marketing. What I wanted was a knowledge base a person can open, reject, and ship through the same review as code. The unit of memory is a markdown file. Git is the history. The README already says that a vector index has to wait for a benchmark that shows grep is not enough. I have not run that benchmark, so the index is not in the repo.

There are two trees and one contract. `~/.agents` holds the way of working that should survive a change of repository: rules, skills, scripts, templates, and the few notes that still make sense after the project-specific details are stripped out. Inside a repository, `.agents/` holds what is true *there*, and `AGENTS.md` at the root is the file an agent can actually be pointed at. Claude Code, Cursor, and Codex do not share a loader. The cabinet can stay put. The doorbell is allowed to change per tool.

`init-global.sh` copies that cabinet to `~/.agents`. `init-project.sh` copies a project skeleton into a repository you name. Both stop when the destination file already exists. `--force` is the only way through. The global install also skips `rules/project.md`. That file is where a repo records its own stack, test command, and constraints, and a later copy of the template should not paint over it.

A memory entry has to earn the status `active`. The template asks for fifteen frontmatter fields. `type` is one of bugfix, decision, pattern, workflow, environment. `status` starts at needs-review and moves to active only when the note can say when it applies, what was confirmed, and which file, commit, or command is the evidence. Superseded and archived are how an old note leaves the default search without being deleted. `doctor.sh` checks the directories, the executable bit on the scripts, the skill frontmatter, and then `validate-memory.py`. GitHub Actions runs that doctor, plus the init tests, on Ubuntu with Python 3.11 for every push to main. An agent is going to edit this tree. The script is there so a bad edit fails in the open.

Search walks the project memory first and `~/.agents/memory` second. With no extra flags it leaves out `archive/` and any entry marked superseded or archived, even when the file was never moved. What remains is ordered by status, then by confidence, then by filename. You can filter on type, status, confidence, and tag, or pass `--summary` and get the card instead of the hit. That is the retrieval system. Rank is a three-key sort in `search-memory.py`, not a model.

The install prompt took more commits than the search, and I trust that ratio. The README carries a block you paste into an agent so it can set the machine up. The first draft said clone and run. The next commits put the clone in a directory from `mktemp`, turned on `set -euo pipefail`, and delete that directory with a trap on EXIT. One more commit changed the outer fence to four backticks, because the prompt contains a fenced shell script and a three-backtick fence closes too early. A one-liner that writes into `$HOME` has to survive an agent that only half-reads it. Those four documentation commits, all on the afternoon of the 24th, are the part I would keep if I threw the rest away.

Reports were the other leak. Ask an agent for a review and it will leave a long markdown file in the repository it was reviewing, where the next commit can pick it up. The delivery rule sends those files to `~/.agents/outputs/<project>/reports/`, beside artifacts and test logs, outside the worktree. A decision the project should keep still goes under `.agents/memory` or `docs/`, and it gets committed. A Tuesday audit stays on the machine.

The philosophy file landed on 26 October, after the scripts. It is a short reading of GitHub's engineering zen: practicality beats purity, anything added dilutes everything else, half measures are as bad as nothing, design for failure. The same day I folded their tone and their writing rules into the language file. Written on the first morning, the zen page would have been a poster. Written after `copy_file_safe` and the superseded filter, it describes commits that were already on main.

The part I expect to go stale is skills. Doctor only checks that a skill's frontmatter parses. It will not notice a directory of overlapping instructions, each one claiming to be the way to change code. The line about dilution is the brake, and it is a sentence in a markdown file. Someone will have to delete, and that someone is probably me.

If you install it, the last lines the script prints are the real documentation. Point the agent at `~/.agents/AGENTS.md`. Run `doctor.sh`. The folder does not start itself.
