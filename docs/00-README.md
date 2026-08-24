# Retell Documentation Suite

Full product and engineering documentation for Retell, a five minute daily voice session that
drills your own interview stories against real question variants.

## Document map

| # | Document | Track | Audience |
| --- | --- | --- | --- |
| 01 | Product Requirements Document | Non-technical | Everyone, first |
| 02 | System Architecture | Technical | Engineering |
| 03 | Delivery Plan and Engineering Standards | Both | Engineering |
| 04 | Voice and Evaluation | Technical | Engineering |
| 05 | Spaced Repetition | Both | Engineering, product |
| 06 | Data and Privacy | Both | Engineering, anyone asking what is stored |
| 07 | Design System | Both | Engineering, design |

## Reading order

1. **01 PRD** for the what and why. Every other document derives from it.
2. **02 System Architecture** for how it is built and what was rejected.
3. **03 Delivery Plan** for the order of work and the gates.
4. **04, 05, 06, 07** as needed. 04 owns the rubric, 05 owns the scheduler, 06 owns the schema,
   07 owns type, colour, shape and motion.

## The other layers

This folder is the strategy layer and is the source of truth.

| Layer | Location | Purpose |
| --- | --- | --- |
| Decisions | `docs/decisions/` | Append-only ADRs: why a choice was made, what was rejected |
| Process | `docs/workflow/` | The development loop, testing, deployment, maintenance |
| Working context | `../context/` | Loaded every session via `../CLAUDE.md` |

**Precedence:** `docs/` beats `context/` on any conflict. ADRs explain `docs/`. `context/` is a
compact summary regenerated from `docs/`, never the reverse.

## Status

| Field | Value |
| --- | --- |
| Product | Retell |
| Phase | 1 |
| Owner | Deshan Ekanayaka |
| Version | 0.1 |
| Business model | Free in Phase 1. No payment code. Eventual shape TBD at the Phase 2 gate |
| Positioning | Everyone else gives you a mock interview once you already have one booked. Retell makes interview practice a five minute daily habit, spoken out loud, so you are ready before you apply |
