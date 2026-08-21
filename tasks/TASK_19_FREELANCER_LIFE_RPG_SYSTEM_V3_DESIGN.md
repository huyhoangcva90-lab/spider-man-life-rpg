# TASK

Freelancer Life RPG System V3 — Product Architecture, Economy, Balance and Effect Contract

# OBJECTIVE

Design a coherent, sustainable Life RPG system specifically for a 29-year-old male freelancer. Every durable system and collectible must have a clear purpose, and every gameplay benefit must ultimately be powered by legitimate real-life actions.

This is a design-contract task. Do not implement code yet. Produce the authoritative V3 specification and migration plan that the next Antigravity task can implement incrementally.

# USER OUTCOME

The product must feel like:

> “I am building a freelance career, body, mind, relationships and financial stability by playing a serious RPG through my real life.”

It must not feel like a habit tracker with superhero decoration, a slot machine, or a system where arbitrary clicks create progress.

# CURRENT CONTEXT

The current vanilla HTML/CSS/JS prototype includes:

- V2 localStorage state, version merging and action ledger;
- Level, six attributes, mastery tracks, skill points, Gold, Energy and Momentum;
- Habits, tasks, quests, goals, projects and boss encounters;
- 37 Suits, 48 Skills, 16 Gadgets, 26 Allies, 36 Spider-People and 30 Villains;
- Build modifiers, boss phases, weaknesses, loot, collection and reward shop;
- Spider Tracker map and synthesized sound.

Problems to solve:

- Several systems are parallel counters without enough decision value.
- Many content cards are visual or have modifiers that are inconsistent, unbounded or not actually resolved by the engine.
- Freelancer-specific domains such as client delivery, lead generation, finance/admin, portfolio, recovery and burnout are weak.
- Tiny tasks can be over-rewarded relative to deep work or project milestones.
- Boss/project relationships need clearer pacing and anti-farming rules.
- The user needs a daily plan that is useful at age 29, not childish streak pressure.

# RESEARCH BASELINE

Use the following product lessons without copying any product:

1. Habitica: separate Habits, Dailies and To-dos; real actions power quests; avoid party-style punitive damage for this solo prototype.
   - `https://habitica.com/static/features`
   - `https://habitica.com/static/faq`
2. LifeUp / ulives: configurable attributes, skill XP, coins, achievements, Pomodoro/focus rewards and self-defined real-life reward shop.
   - `https://docs.lifeupapp.fun/zh-cn/`
   - `https://app.ulives.io/`
3. Amazing Marvin: daily plan, Super Focus Mode, time tracking, goals, sequential projects and modular strategies for procrastination/overwhelm.
   - `https://help.amazingmarvin.com/en/collections/1139197-strategies`
4. Finch: self-care should feel supportive, personalized and non-punitive.
   - `https://help.finchcare.com/hc/en-us/articles/37935669335309-Our-Approach-to-Self-Care`

# PERSONA

Primary user:

- male, 29;
- independent freelancer working alone or with small clients;
- irregular workload and income;
- needs deep work, client communication, delivery discipline, lead generation, portfolio building and admin;
- wants fitness, sleep/recovery, learning, relationships and leisure to remain balanced;
- at risk of overwork, procrastination, context switching, feast/famine income cycles and burnout;
- wants mature tactical presentation, not infantilizing copy.

# REQUIRED SYSTEM DESIGN

## 1. Core loop

Design one explicit loop:

`Plan day → complete verified real action → resolve reward packet → grow attributes/masteries → activate build/card effects → advance project encounter → earn durable loot/achievement → improve future planning/build choices`.

Define what happens daily, weekly and per project.

## 2. Life domains and action taxonomy

Design freelancer-relevant domains with stable generic IDs. At minimum cover:

- `client_work` — delivery, revision, meetings;
- `business_growth` — leads, proposals, sales, networking;
- `craft` — core professional skill and portfolio;
- `health` — training, movement, nutrition;
- `recovery` — sleep, breaks, mental reset;
- `life_admin` — invoices, tax, files, home/admin;
- `relationships` — family, friends, community.

Define Habit, Daily, Task, Focus Session, Quest, Project, Milestone and Goal. State which can reward currencies, mastery, boss damage and loot eligibility.

## 3. Progression hierarchy

Separate and justify:

- Account Level — long-term breadth/unlocks;
- Attributes — six stable capabilities;
- Masteries — repeated domain expertise;
- Skill Points/Skills — chosen rules and build identity;
- Equipment/Allies/Identity Cards — loadout choices;
- Achievements — verified milestones and account history;
- Gold — controlled real-life reward currency;
- Loot — build components/cosmetics/blueprints, never raw fake progress.

Recommend whether to preserve current internal attribute IDs (`power`, `agility`, `intellect`, `focus`, `discipline`, `willpower`) with better freelancer-facing labels, or migrate them. Prefer save-compatible aliases unless migration has a decisive benefit.

## 4. Resource model

Give Energy and Momentum distinct uses. Consider a bounded Pressure/Stress or Recovery state only if it adds real decisions without shame/punishment.

Define:

- how resources change through real actions;
- start-of-day and end-of-day behavior;
- caps and safeguards;
- how recovery actions matter without becoming farmable;
- what happens on a bad day (grace, pause, recovery mode) without deleting progress.

## 5. Reward and anti-farming formula

Create concrete formulas/tables for:

- effort/duration bands;
- difficulty;
- importance/impact;
- action type;
- deadline urgency without rewarding procrastination;
- quality/reflection where appropriate;
- repetition decay and daily caps;
- XP, Gold, Attribute XP, Mastery XP, Energy/Momentum and boss attack packet.

Use mature targets: a sustainable day of 3–6 meaningful actions and 1–3 focus sessions should feel productive. Fifty tiny tasks must not outperform a real 90-minute delivery milestone.

## 6. Freelancer campaign model

Map real freelance work into gameplay:

- Client/contract → Campaign or Project;
- deliverables → Milestones;
- risks/blockers → Villain mechanics;
- proposal/lead pipeline → optional business quests;
- invoice/payment/admin → completion/settlement phase;
- post-mortem/testimonial/portfolio update → epilogue rewards.

Boss HP must represent project scope/progress, not arbitrary grind. Define how actions qualify for encounter damage and how a final milestone unlocks a finisher without letting unrelated tasks kill the boss.

## 7. Unified Effect Engine

Design a declarative effect schema that all gameplay content uses:

```js
EffectDefinition = {
  id,
  trigger,
  target,
  operation,
  value,
  conditions,
  limits,
  stackingRule,
  priority,
  copy
}
```

Define supported triggers, targets, operations, conditions, caps, stacking rules and resolution order. Effects must modify a legitimate action/encounter transaction; clicking a card never creates rewards.

## 8. Card and build system

Make every card type meaningful:

- Identity/Spider-Person card;
- Suit;
- Gadget;
- Ally;
- Skill/Move;
- Loot/Relic if retained.

Design a limited loadout/deck (exact slots and why), equip costs/rules, synergy tags, active/passive/triggered effects, cooldowns/charges if needed and clear UI explanation.

Every non-cosmetic card must have at least one validated effect. Cosmetics must be explicitly labeled and must not pretend to affect gameplay. Villain cards are encounter definitions, not player buffs.

Include a strategy for assigning coherent effects to the current 37 Suits, 48 Skills, 16 Gadgets, 26 Allies and 36 Identity cards without writing hundreds of one-off branches.

## 9. Balance model

Define:

- level XP curve for levels 1–50;
- attribute XP curve and sensible soft caps;
- mastery ranks 0–10;
- skill point cadence and respec policy;
- build modifier budgets by rarity/tier;
- multiplicative/additive caps;
- Gold income and real-life reward pricing bands;
- boss HP/armor/stagger ranges by small/medium/large freelance project;
- loot cadence and duplicate handling;
- catch-up/grace rules after inactivity.

Provide worked examples for:

1. 25-minute admin focus session;
2. 90-minute client delivery session;
3. workout habit;
4. send a proposal/lead action;
5. final project milestone;
6. recovery day.

## 10. Daily/weekly UX

Design a mature Home flow answering:

- What is the highest-value thing I should do now?
- What client/project is at risk?
- Do I need focus, business development, health or recovery?
- What build effect is active and why?
- What did I actually improve this week?

Limit cognitive load. Define “Today Loadout,” “Next Best Action,” focus session, daily shutdown and weekly review.

## 11. Persistence and migration

Design V2 → V3 migration with no data loss:

- schemaVersion 3;
- preserve stable IDs, level, XP, unlocked/equipped content, ledger, inventory and projects;
- map existing stats/masteries/resources;
- normalize every content effect;
- validation and safe fallback;
- rollback/export boundary.

## 12. Analytics and balancing without backend

Define local-only metrics for balancing:

- completion counts by domain/duration;
- reward distribution;
- skipped/overdue actions;
- focus minutes;
- recovery balance;
- build effect contribution;
- boss/project velocity.

No surveillance, no cloud, no manipulative streak messaging.

# REQUIRED DECISIONS

The document must make explicit decisions, not offer endless options. Include:

- one canonical V3 state model;
- one reward formula;
- one effect resolution order;
- one loadout slot model;
- one balance table;
- one migration sequence;
- one implementation roadmap of small milestones.

# DELIVERABLES

Create:

1. `docs/FREELANCER_LIFE_RPG_SYSTEM_V3.md`
2. `docs/V3_BALANCE_TABLES.md`
3. `docs/V3_EFFECT_CATALOG_AUDIT.md`
4. `tasks/TASK_20_V3_ENGINE_VERTICAL_SLICE.md` — the first implementation task only, scoped to engine/state/reward/effect vertical slice.

# ACCEPTANCE CRITERIA

- System is coherent for the stated freelancer persona.
- Every currency/progression layer has a non-overlapping purpose.
- Every card/content category has a defined gameplay role or explicit cosmetic status.
- Reward formulas and caps prevent tiny-task farming.
- Recovery is meaningful and non-punitive.
- Project/boss damage reflects related real work.
- Effect schema is executable in vanilla JS and backend-portable later.
- V2 saves can migrate safely.
- Roadmap is incremental and does not require rewriting the whole app at once.

# DO NOT

- Do not edit application code in this task.
- Do not edit root `app.js`.
- Do not call terminal/command tools.
- Do not introduce backend/auth/framework/build tooling.
- Do not use gambling mechanics, paid currency, financial punishment or shame-based streak loss.
- Do not make all numbers grow independently without decisions.
- Do not make UI/card clicks generate durable progression.
