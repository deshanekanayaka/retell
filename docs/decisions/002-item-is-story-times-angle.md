# ADR-002: The scheduled item is a story paired with an angle

- **Status**: Proposed
- **Date**: 2026-08-22

## Context

Spaced repetition needs an item with an identity and a history. Three candidates existed: the
question, the story, or the pairing of a story with a question angle. The choice determines what
the product actually trains and what its data can express.

## Decision

An item is one story paired with one question angle, unique on (user, story, angle). Items are
created when a pairing is first attempted, not generated in advance.

## Alternatives rejected

- **The question as the item**: the user answers with the same story every time, becomes fluent
  at one pairing, and never discovers the other stories they could have used.
- **The story as the item**: a story can be strong for one angle and useless for another, so one
  schedule per story averages over the distinction that matters.

## Consequences

- `item` points at an angle, not at a `question_id`, so an item's history survives being asked
  in different wordings. Angle slugs become a contract; renaming one invalidates every item.
- Twist questions become first class rather than decoration, because a twist is a new angle on a
  story the user thought was covered.
- More items exist than a five minute session can cover, so items are created lazily and the
  session composition rules decide what is drilled.
- The stories against angles grid becomes possible, which is the clearest artifact the product
  produces.

## References

01-PRD.md FR-26. 05-spaced-repetition.md sections 1 and 4.
