# TASK

Complete Remaining Freelancer Life RPG V3 Design Deliverables

# CONTEXT

The previous Antigravity run completed `docs/FREELANCER_LIFE_RPG_SYSTEM_V3.md` but hit model quota before producing the three remaining deliverables. Read that completed document first. Do not rewrite it unless a direct contradiction must be corrected.

Read `tasks/TASK_19_FREELANCER_LIFE_RPG_SYSTEM_V3_DESIGN.md` for the full product requirements. Then finish only the missing outputs below.

# REQUIRED OUTPUTS

## 1. `docs/V3_BALANCE_TABLES.md`

Create executable balance tables and formulas consistent with the main V3 spec:

- reward calculation order and clamping;
- duration, effort, difficulty, impact and action-kind bands;
- XP, Gold, Attribute XP, Mastery XP, Energy, Momentum and encounter packet;
- repetition decay, domain caps, daily soft/hard caps and anti-farming;
- levels 1–50 curve;
- attribute curve/soft caps;
- mastery rank 0–10 curve;
- skill point cadence/respec;
- modifier budget and additive/multiplicative caps;
- Gold income and real reward price bands;
- small/medium/large freelance project boss ranges;
- loot cadence and duplicate conversion;
- inactivity grace/recovery mode;
- worked examples for admin 25m, client delivery 90m, workout, proposal, final milestone and recovery day.

Every table must contain canonical numeric values, not option ranges without a decision.

## 2. `docs/V3_EFFECT_CATALOG_AUDIT.md`

Audit current content categories and define how every current collectible gets a real role through generic effect templates:

- 37 Suits;
- 48 Skills;
- 16 Gadgets;
- 26 Allies;
- 36 Spider/Identity cards;
- Loot/Relics;
- 30 Villains as encounter definitions, not player buffs.

Define:

- canonical effect schema;
- triggers, targets, operations, conditions, limits, stacking, priority;
- resolution order;
- validation errors and fallback behavior;
- loadout slots and modifier budget;
- reusable effect archetype families;
- mapping/audit table showing which current entries are functional, descriptive-only, cosmetic or invalid;
- migration strategy so every non-cosmetic entry has at least one validated effect and cosmetics are explicitly labeled.

Do not write hundreds of one-off villain/content branches.

## 3. `tasks/TASK_20_V3_ENGINE_VERTICAL_SLICE.md`

Write the first implementation task in the user's required format:

- TASK
- OBJECTIVE
- CONTEXT
- FILES
- REQUIREMENTS
- DATA MODEL
- UI
- GAME LOGIC
- ACCEPTANCE CRITERIA
- TEST
- DO NOT

Scope Task 20 narrowly to:

- schemaVersion 3 migration;
- canonical action context/reward packet;
- anti-farming formula;
- EffectEngine with a small representative set of effects;
- freelancer domains;
- one 90-minute client delivery vertical slice;
- one Suit + one Skill + one Gadget + one Ally + one Identity card all affecting the legitimate transaction;
- project-related boss damage only;
- event/reward breakdown UI so every modifier is explainable;
- V2 save preservation and regression tests.

Do not implement application code in this design-completion task.

# ACCEPTANCE CRITERIA

- All three missing files exist and are internally consistent with `FREELANCER_LIFE_RPG_SYSTEM_V3.md`.
- Numerical balance is canonical and testable.
- Effect audit covers all current content categories.
- Task 20 is small enough for one implementation run and preserves V2 saves.

# DO NOT

- Do not edit application code or root `app.js`.
- Do not call terminal/command tools.
- Do not redo the completed main V3 document.
- Do not add backend/framework/build tooling.
