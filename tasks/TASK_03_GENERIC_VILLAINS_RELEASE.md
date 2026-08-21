# TASK

Generic Villain Mechanics and Prototype Release QA

# OBJECTIVE

Finish the prototype architecture with a declarative encounter mechanic resolver, three genuinely different villains, and release hardening without adding large content volume.

# CONTEXT

TASK 01–02 are implemented. Preserve V2 persistence, action ledger, loot, restart attempts, taxonomy and data-driven Build modifiers. Read architecture and implementation notes.

# FILES

`data/villains.js`, `data/quests.js`, `js/boss-system.js`, `js/game-engine.js`, `js/storage.js`, `js/app.js`, `index.html`, `styles.css`, and `docs/IMPLEMENTATION_NOTES_TASK_03.md` only as needed. Do not edit root `app.js`.

# REQUIREMENTS

1. Normalize villain definitions to stable phase IDs, weaknesses and declarative mechanics.
2. BossSystem resolves phase using each villain's definitions, not hard-coded 25/50/75 thresholds.
3. Implement exactly three differentiated encounters using generic descriptors:
   - Doctor Octopus: lane/complexity pressure; matching Intellect or milestone tags bypass part of armor.
   - Mysterio: priority/decoy mechanic; non-priority actions deal reduced damage, Focus/priority actions reveal weakness.
   - Lizard: regeneration; physical/health actions suppress regeneration for the next resolution.
4. No villain-specific conditions in UI; resolver interprets mechanic descriptors.
5. Villain selection/new project must initialize authoritative HP/armor/stagger/phase/mechanicState and a unique encounter ID.
6. Boss Arena displays current phase, active mechanic, weakness and the last mechanic event in clear game language.
7. Defeat/loot/restart remain idempotent for every villain; unknown loot definitions degrade safely.
8. Add schema merging/defaults for `mechanicState` and phase ID without losing existing V2 saves.
9. Remove or guard any fake combat shortcuts that grant durable progression without a real-life action. QTE/gadget UI may provide feedback but must not independently mint XP/Gold or defeat a Boss; it may modify the next legitimate action.
10. Release hardening: all views, empty states, focus, reduced motion, 360px and desktop overflow; no console errors.

# ACCEPTANCE CRITERIA

- Same action packet resolves differently against Doc Ock, Mysterio and Lizard for documented mechanical reasons.
- Phase transitions come from definitions and emit events shown in Boss Arena.
- Real-life action is the only durable progression trigger.
- TASK 01/02 ledger, migration, loot, build modifiers and responsive tests still pass.
- Fresh install and migrated V2 complete the vertical slice without console errors.

# DO NOT

No backend/auth/framework/build tool, no large content generation, no villain-specific UI branches, no direct UI state/reward mutation, no legacy root app.js edits, no shell commands in headless Antigravity.
