---
name: log-bug
description: Log a real bug and its fix to context/bugs.md, brief, with a technical and a plain-language version
argument-hint: <optional short description>
---

## Task

Append one entry to `context/bugs.md` for the bug just found and fixed this conversation:
$ARGUMENTS

## Format

Append to the end of the file, never edit or remove past entries:

```
## <short title> — YYYY-MM-DD

**Technical**: 1-2 sentences. Precise: file paths, API/function names, the actual error message.
**Plain**: 1-2 sentences. No jargon, real-world framing, what happened and what changed.
**Fix**: 1 sentence. What actually changed, and (if relevant) how it was caught.
```

## Rules

- Brief. This is a log, not a postmortem — resist the urge to explain everything.
- The plain version describes the same bug in plain language, not a shorter summary of the
  technical version — someone who doesn't read code should understand what happened from it
  alone.
- Only log a real bug: something that was wrong and got fixed, ideally one that lint, typecheck,
  or tests didn't catch (those are the ones worth remembering, since the gates already cover the
  rest). A spec-vs-reality conflict resolved by a product decision counts too.
- If nothing bug-shaped happened this conversation, say so and don't write an entry.
