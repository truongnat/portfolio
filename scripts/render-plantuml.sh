#!/usr/bin/env bash
# Regenerate SVG previews from docs/features/*.puml (requires PlantUML + Graphviz).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLANTUML="${PLANTUML:-}"
if [[ -z "$PLANTUML" ]]; then PLANTUML="$(command -v plantuml 2>/dev/null || true)"; fi
if [[ -z "$PLANTUML" && -x /opt/homebrew/bin/plantuml ]]; then PLANTUML=/opt/homebrew/bin/plantuml; fi
if [[ -z "$PLANTUML" && -x /usr/local/bin/plantuml ]]; then PLANTUML=/usr/local/bin/plantuml; fi
if [[ -z "$PLANTUML" ]]; then
  echo "plantuml not found. Install: brew install plantuml" >&2
  exit 1
fi
cd "$ROOT/docs/features"
"$PLANTUML" -tsvg ./*.puml
echo "Rendered SVG diagrams in docs/features/"
