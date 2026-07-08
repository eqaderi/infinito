#!/usr/bin/env bash
# .claude/hooks/guard.sh — deterministic guardrails for the Infinito repo.
# PreToolUse hook: tool call arrives as JSON on stdin; exit 2 blocks the action
# and the stderr message is shown to the model. Zero dependencies (no jq) so it
# can never fail open on a machine missing a tool.
set -euo pipefail
INPUT=$(cat)

deny() { echo "BLOCKED by .claude/hooks/guard.sh: $1" >&2; exit 2; }

tool() { grep -qE "\"tool_name\"[[:space:]]*:[[:space:]]*\"$1\"" <<<"$INPUT"; }

if tool "Edit" || tool "Write"; then
  if grep -qE '"file_path"[[:space:]]*:[[:space:]]*"[^"]*(Final_Files|working_dir|Documentation)/' <<<"$INPUT"; then
    deny "legacy trees are read-only design references (AGENTS.md). Never modify them — copy behavior, not code."
  fi
  if grep -qE '"file_path"[[:space:]]*:[[:space:]]*"[^"]*rebuild/docs/baseline/' <<<"$INPUT"; then
    deny "baseline captures are immutable evidence. If a baseline is wrong, tell the human — never edit or overwrite it."
  fi
fi

if tool "Bash"; then
  if grep -qE 'git push[^|;&"]*(--force|--force-with-lease|-f[[:space:]"])' <<<"$INPUT"; then
    deny "force-push is forbidden. Rebase locally or open a new PR."
  fi
  if grep -qE '(rm -rf?|[^\\]>|>>)[^|;&"]*(Final_Files|working_dir|Documentation|rebuild/docs/baseline)' <<<"$INPUT"; then
    deny "that command writes to or deletes a read-only reference tree."
  fi
fi
exit 0
