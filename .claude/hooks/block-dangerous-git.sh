#!/bin/bash
# Blocks destructive git commands before Claude Code executes them.
# Enforces CLAUDE.md's git safety rules at the shell level, not just as a written rule.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

DANGEROUS_PATTERNS=(
  "git push"
  "git reset --hard"
  "git clean -fd"
  "git clean -f"
  "git branch -D"
  "git checkout \."
  "git restore \."
  "push --force"
  "reset --hard"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "BLOCKED: '$COMMAND' matches dangerous pattern '$pattern'. Ask the user to run this themselves." >&2
    exit 2
  fi
done

exit 0
