---
title: "dotagents is a folder on purpose"
date: "2026-10-27"
description: "Two directories, a markdown memory note, and a ripgrep search. The install prompt, the doctor check, and the commits that made them."
slug: "how-i-built-dotagents"
published: true
tags: ["AI/ML", "Agents", "Tooling"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1000"
---

On 24 October 2026 the first commit in [dotagents](https://github.com/truongnat/dotagents) was a directory layout. The message called it a blueprint: [`f9c076b`](https://github.com/truongnat/dotagents/commit/f9c076b). Two days later the history was eleven commits long, and the search script still shells out to ripgrep. This post walks those pieces with the code and the commits, not a summary of them.

I wrote it because an agent memory that records every session is a junk drawer with cleaner marketing. What I wanted was a knowledge base a person can open, reject, and ship through the same review as code. The unit of memory is a markdown file. Git is the history. A vector index has to wait for a benchmark that shows grep is not enough. I have not run that benchmark.

> The index is not in the repo. [README principle 5](https://github.com/truongnat/dotagents/blob/c52bc8e/README.md) says start with Markdown and Git, and use `rg` before adding a vector search, a database, or a memory service. Until that benchmark exists, adding the index would be a second retrieval system with nothing to beat.

## Two directories, one file a tool can load

There are two trees. `~/.agents` holds the way of working that should survive a change of repository: rules, skills, scripts, templates, and the notes that still make sense after the project-specific details are stripped out. Inside a repository, `.agents/` holds what is true there. `AGENTS.md` at the root is the file an agent can actually be pointed at. Claude Code, Cursor, and Codex do not share a loader. The cabinet can stay put. The doorbell is allowed to change per tool.

![The global cabinet is ~/.agents. The project cabinet is .agents. AGENTS.md is the file a tool loads.](/blog/dotagents-two-trees.svg)

`init-global.sh` copies the cabinet to `~/.agents`. `init-project.sh` copies a project skeleton into a repository you name. Both stop when the destination file already exists. `--force` is the only way through. The copy is a small function, and the interesting line is the one that refuses:

```bash
copy_file_safe() {
  local src="$1"
  local dest="$2"
  local rel="$3"

  mkdir -p "$(dirname "$dest")"
  if [[ -f "$dest" && "$force" != true ]]; then
    echo "  - Giữ nguyên (đã tồn tại): $rel"
  else
    cp "$src" "$dest"
    echo "  + Sao chép: $rel"
  fi
}
```

That function lives in [`.agents/scripts/init-global.sh`](https://github.com/truongnat/dotagents/blob/c52bc8e/.agents/scripts/init-global.sh). The global install also skips `rules/project.md`. That file is where a repo records its own stack, test command, and constraints, and a later copy of the template should not paint over it. The project init test writes a sentinel into that file and fails if a second run without `--force` replaces it. The sentinel in [`.agents/scripts/test-init-project.sh`](https://github.com/truongnat/dotagents/blob/c52bc8e/.agents/scripts/test-init-project.sh) is the string `CUSTOM PROJECT RULES DO NOT OVERWRITE`.

## A note has to earn `active`

A memory entry starts as a draft. The template asks for fifteen frontmatter fields. `type` is one of bugfix, decision, pattern, workflow, environment. `status` starts at `needs-review` and moves to `active` only when the note can say when it applies, what was confirmed, and which file, commit, or command is the evidence. `superseded` and `archived` are how an old note leaves the default search without being deleted.

This is the head of [`.agents/template/memory/memory-entry.md`](https://github.com/truongnat/dotagents/blob/c52bc8e/.agents/template/memory/memory-entry.md):

```yaml
schema_version: 1
id: "MEM-YYYYMMDD-short-topic"
title: "Một câu ngắn gọn, rõ ràng và dễ tìm kiếm"
type: bugfix # bugfix | decision | pattern | workflow | environment
scope: project # project | global
status: needs-review # active | needs-review | superseded | archived
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
verified_on: "YYYY-MM-DD" # dùng "unknown" nếu chưa xác minh
confidence: medium # high | medium | low
tags: [subsystem, symptom, technology]
applies_to:
  repo: "tên repository hoặc any"
  stack: "framework/runtime"
  versions: "phạm vi phiên bản đã biết hoặc unknown"
sources:
  - "path/to/file.ts"
  - "URL hoặc ID của PR/issue/commit/tài liệu"
related: []
supersedes: null
```

The body under that frontmatter is not optional decoration. The template asks for when the note applies, what was observed, what was confirmed, and the root cause or the decision. A file that cannot fill those sections stays at `needs-review`. `validate-memory.py` is what `doctor.sh` runs against `memory/entries`, and the doctor message on success is specific: fifteen frontmatter fields and the enums those fields allow.

## Search is a sort, then ripgrep

Search walks the project memory first and `~/.agents/memory` second. The path order is fixed in `get_memory_paths`: `.agents/memory` under the git toplevel, then `$AGENTS_HOME/memory`, which defaults to `~/.agents/memory`. With no extra flags the walk leaves out `archive/` and any entry marked `superseded` or `archived`, even when the file was never moved.

What remains is ordered by status, then by confidence, then by filename. You can filter on type, status, confidence, and tag, or pass `--summary` and get the card instead of the hit.

```bash
python3 .agents/scripts/search-memory.py "copy_file_safe" --type decision --summary
```

The rank is this sort, from [`.agents/scripts/search-memory.py`](https://github.com/truongnat/dotagents/blob/c52bc8e/.agents/scripts/search-memory.py) at [`9e30a52`](https://github.com/truongnat/dotagents/commit/9e30a52):

```python
status_rank = {"active": 0, "needs-review": 1, "superseded": 2, "archived": 3}
conf_rank = {"high": 0, "medium": 1, "low": 2}
candidate_files.sort(
    key=lambda item: (
        status_rank.get(item[1].get("status", ""), 9),
        conf_rank.get(item[1].get("confidence", ""), 9),
        item[0].name,
    )
)
```

After that sort, a text query is handed to ripgrep over the remaining files. If `rg` is not on `PATH`, the script scans the same files in Python and prints `line:text`. There is no embedding and no score beyond that three-key sort.

```python
cmd = [rg_path, "--line-number", "--heading", "--color", "never", "--smart-case", "--", query]
cmd.extend(str(f) for f in files)
res = subprocess.run(cmd)
return res.returncode == 0
```

That is the retrieval system. I do not have a measurement that says it misses notes a vector index would have found. Until I do, the README rule stands.

## The install prompt took four commits

The README carries a block you paste into an agent so it can set the machine up. The first draft said clone and run. The next commits, all on the afternoon of the 24th, are the part I would keep if I threw the rest of that day away.

| Commit | What changed in the prompt |
|---|---|
| [`3019b31`](https://github.com/truongnat/dotagents/commit/3019b31) | The one-prompt setup block lands in the README. |
| [`798f477`](https://github.com/truongnat/dotagents/commit/798f477) | The clone goes into a directory from `mktemp`, and the prompt tells the agent to run `doctor.sh` after install. |
| [`34fc8a4`](https://github.com/truongnat/dotagents/commit/34fc8a4) | `set -euo pipefail` is on, and a `trap` deletes that directory on `EXIT`. |
| [`cdc37f7`](https://github.com/truongnat/dotagents/commit/cdc37f7) | The outer fence becomes four backticks. |

The last one is a markdown bug, not a product idea. The prompt contains a fenced shell script. Wrap that prompt in a three-backtick fence and the inner shell fence closes the outer one. Everything after that inner fence never reaches the agent. A one-liner that writes into `$HOME` has to survive an agent that only half-reads it.

The shape that failed:

````markdown
```markdown
Run this:
```bash
echo "the outer fence already closed"
```
This line was never part of the prompt.
```
````

The shape in the README now, from [`cdc37f7`](https://github.com/truongnat/dotagents/commit/cdc37f7), uses four backticks outside and three inside. The shell block itself is the one I want a person to read before they paste it:

```bash
bash -euo pipefail -c '
  TMP_DIR="$(mktemp -d)"
  trap "rm -rf \"$TMP_DIR\"" EXIT
  git clone --depth 1 https://github.com/truongnat/dotagents.git "$TMP_DIR"
  "$TMP_DIR/.agents/scripts/init-global.sh"
  chmod +x ~/.agents/scripts/*.sh ~/.agents/scripts/*.py
  ~/.agents/scripts/doctor.sh
'
```

`mktemp` keeps the clone out of the current repository. The trap removes it even when the clone or the init script fails. `doctor.sh` is the last command, so a paste that "succeeds" without a health check is no longer the documented path.

## The check runs on push, not in the chat

An agent is going to edit this tree. The script is there so a bad edit fails in the open. [`.github/workflows/ci.yml`](https://github.com/truongnat/dotagents/blob/c52bc8e/.github/workflows/ci.yml) runs on every push and pull request to `main`, on `ubuntu-latest`, with Python 3.11. The step is `doctor.sh`, then `test-init-project.sh`, then `test-init-global.sh`.

`doctor.sh` prints four groups and then the unit tests. A missing core directory is reported with a cross and, in the current script, does not by itself increment the failure counter. These do:

- a script under `scripts/` that is not executable
- `validate-skills.sh` rejecting a skill's frontmatter
- `validate-memory.py` rejecting an entry
- `test-validate-memory.py` or `test-search-memory.py` failing

```bash
if python3 "$AGENTS_DIR/scripts/validate-memory.py" "$AGENTS_DIR/memory/entries"; then
  echo "  ✓ Toàn bộ memory entries đạt 15 trường frontmatter và enum chuẩn"
else
  echo "  ✗ Lỗi định dạng memory entries"
  failures=$((failures + 1))
fi
```

Zero failures prints `KẾT QUẢ: MỌI THỨ HOÀN TOÀN TỐT!` and exits 0. Anything else exits 1. That is the gate. It does not read the prose of a skill and decide whether two skills overlap. It checks that the cabinet still parses.

## Reports stay off the branch

Ask an agent for a review and it will leave a long markdown file in the repository it was reviewing, where the next commit can pick it up. The delivery rule sends those files to `~/.agents/outputs/<project>/reports/`, beside artifacts and test logs, outside the worktree. A decision the project should keep still goes under `.agents/memory` or `docs/`, and it gets committed. A Tuesday audit stays on the machine.

The same rule is why this post can cite commits instead of pasting a generated review into `dotagents` itself. The audit is not a source file.

## The philosophy file came after the scripts

On 26 October, [`cb7276a`](https://github.com/truongnat/dotagents/commit/cb7276a) added [`.agents/rules/engineering-philosophy.md`](https://github.com/truongnat/dotagents/blob/c52bc8e/.agents/rules/engineering-philosophy.md). [`4d7ba6a`](https://github.com/truongnat/dotagents/commit/4d7ba6a) and [`c52bc8e`](https://github.com/truongnat/dotagents/commit/c52bc8e) folded tone and writing rules into the language file the same day. Written on the first morning, that page would have been a poster. Written after `copy_file_safe` and the `EXIT` trap, point 13 can name the scripts that were already on main: `set -euo pipefail`, clean the temp directory with `trap EXIT`, and refuse to overwrite a file that exists.

The line I expect to use as a brake is point 3, "Anything added dilutes everything else." Doctor will not notice a directory of overlapping skills, each one claiming to be the way to change code. That line is a sentence in a markdown file. Someone will have to delete, and that someone is probably me.

If you install it, the last lines the script prints are the real documentation. Point the agent at `~/.agents/AGENTS.md`. Run `doctor.sh`. The folder does not start itself.

## References

- Repository: [truongnat/dotagents](https://github.com/truongnat/dotagents)
- First layout: [`f9c076b`](https://github.com/truongnat/dotagents/commit/f9c076b) (24 October 2026)
- Search rank and the default exclusion of superseded notes: [`9e30a52`](https://github.com/truongnat/dotagents/commit/9e30a52)
- Install prompt, in order: [`3019b31`](https://github.com/truongnat/dotagents/commit/3019b31), [`798f477`](https://github.com/truongnat/dotagents/commit/798f477), [`34fc8a4`](https://github.com/truongnat/dotagents/commit/34fc8a4), [`cdc37f7`](https://github.com/truongnat/dotagents/commit/cdc37f7)
- Philosophy file: [`cb7276a`](https://github.com/truongnat/dotagents/commit/cb7276a) (26 October 2026)
- Files cited above: [`search-memory.py`](https://github.com/truongnat/dotagents/blob/c52bc8e/.agents/scripts/search-memory.py), [`memory-entry.md`](https://github.com/truongnat/dotagents/blob/c52bc8e/.agents/template/memory/memory-entry.md), [`init-global.sh`](https://github.com/truongnat/dotagents/blob/c52bc8e/.agents/scripts/init-global.sh), [`doctor.sh`](https://github.com/truongnat/dotagents/blob/c52bc8e/.agents/scripts/doctor.sh), [`ci.yml`](https://github.com/truongnat/dotagents/blob/c52bc8e/.github/workflows/ci.yml)
