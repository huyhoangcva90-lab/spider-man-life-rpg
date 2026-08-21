# Freelancer Life RPG System V3 — Product Architecture, Economy, Balance and Effect Contract

**Document Status:** Authoritative Design Specification & Architecture Contract  
**Target User Persona:** 29-Year-Old Male Independent Freelancer  
**Version:** 3.0.0  
**Data Schema Version:** 3  

---

## 1. Executive Summary & Persona Contract

### 1.1 Core Philosophy
The Freelancer Life RPG System V3 is a local-first, action-driven Life RPG designed to transform real-world freelance operations—client delivery, lead generation, admin/finance, professional craft, health, and mental recovery—into a serious, structured progression system.

**The Golden Contract:**
> "I am building a freelance career, body, mind, relationships, and financial stability by playing a serious RPG through my real life."

Every durable progression point, currency gain, card unlock, and boss damage packet in V3 MUST be earned through verified, legitimate real-life actions. The system strictly rejects:
- Fake progress loops, arbitrary button clicks, or UI idle mechanics;
- Infantilizing copy, superhero fluff without gameplay substance, or punitive streak resets;
- Gambling/gacha mechanics, paid skip buttons, or shame-driven daily penalties.

### 1.2 The Freelancer Persona (Age 29)
- **Work Structure:** Independent solo contractor or small agency partner managing irregular project volume, fluctuating monthly revenue, and multiple client deadlines.
- **Core Operating Needs:** High-focus deep work blocks, proactive client acquisition, timely invoicing/admin, deliberate skill sharpening, structured physical training, and protected recovery cycles.
- **Vulnerabilities:** Overwork leading to cognitive fatigue, context-switching overload, procrastination on administrative/lead-gen tasks, feast-or-famine financial cycles, and eventual burnout.
- **Design Expectation:** A mature, tactical command-center interface providing clear operational priority ("Next Best Action"), clear project risk assessments, bounded stress management, and tangible real-world rewards.

---

## 2. Core Loop & Operational Cadence

### 2.1 The Master Loop
The V3 game loop binds daily personal planning directly to project progression and durable account growth:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                    THE V3 MASTER LOOP                                    │
│                                                                                          │
│ 1. PLAN DAY        ──► Select 3–6 prioritized real actions & set Today Loadout         │
│ 2. EXECUTE ACTION  ──► Complete real-world task, focus session, or habit check-in         │
│ 3. RESOLVE REWARD  ──► Calculate base rewards (Domain XP, Account XP, Gold, Energy/Mom)  │
│ 4. APPLY EFFECTS   ──► Evaluate active Suit, Skill, Gadget, Ally & Identity modifiers     │
│ 5. ADVANCE PROJECT ──► Deal targeted Boss Damage/Stagger based on action domain match    │
│ 6. GROW PROFILE    ──► Level up Account, gain Attribute XP, advance Domain Masteries      │
│ 7. CLAIM MILESTONE ──► Unlock durable Loot, Blueprints, & real-life Reward Shop Gold     │
│ 8. SHUTDOWN & EVAL ──► Review daily velocity, manage Stress/Recovery, plan next iteration│
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Operational Cadence

| Phase | Timeframe | Real-World Activity | Gameplay Resolution |
| :--- | :--- | :--- | :--- |
| **Morning Briefing** | Start of Day (08:00) | Review calendar, queue 3–6 actions, check client project status, equip "Today Loadout". | Energy pool resets to baseline (100). Passive daily effects evaluate. Active project boss hazards display. |
| **Execution Phase** | Mid-Day Work | Run Focus Sessions (Pomodoros/Deep Work), check off tasks, log habits. | Action Ledger records completion. Reward Calculator applies modifiers. Boss encounter takes targeted damage. |
| **Daily Shutdown** | End of Day (18:00–19:00) | Log completed work, record day rating/reflection, trigger recovery reset. | Unprocessed daily overflow evaluated gracefully (zero penalty). Stress score updates. Momentum decays to baseline. |
| **Weekly Retrospective**| End of Week (Sunday) | Audit completed client deliverables, total revenue logged, health consistency. | Weekly Mastery bonus awarded. Respec tokens refreshed. Boss project milestone summary compiled. |

---

## 3. Life Domains & Action Taxonomy

### 3.1 Generic Life Domains
V3 organizes all real-life activities into 7 freelancer-centric domains identified by stable generic IDs:

1. **`client_work` (Client Delivery & Service):** Deep work, feature execution, design revisions, client meetings, project deliverables.
2. **`business_growth` (Sales & Marketing):** Lead generation, cold outreach, proposal writing, networking, client discovery calls.
3. **`craft` (Skill Mastery & Portfolio):** Learning new frameworks/tools, building side projects, updating portfolio, writing case studies.
4. **`health` (Physical Energy & Fitness):** Workout sessions, running, mobility, nutrition tracking, hydration.
5. **`recovery` (Mental Rest & Sleep):** Sleep hygiene, meditation, nature walks, complete offline breaks, burnout prevention.
6. **`life_admin` (Operations & Finance):** Invoicing, tax filing, expense logging, email triage, workspace organization, home chores.
7. **`relationships` (Network & Personal Life):** Family time, friend catchups, community involvement, professional mentorship.

### 3.2 Action Taxonomy & Reward Capability Matrix

V3 establishes strict boundaries on what each action type can reward to prevent tiny-task grinding from outperforming major deliverables:

```text
Action Type      │ Account XP │ Gold │ Attribute XP │ Mastery XP │ Energy/Mom │ Boss Damage │ Boss Stagger │ Loot Eligible
─────────────────┼────────────┼──────┼──────────────┼────────────┼────────────┼─────────────┼──────────────┼───────────────
Habit            │ Low        │ Low  │ Yes          │ Yes        │ +Momentum  │ None        │ Low          │ No
Daily            │ Medium     │ Low  │ Yes          │ Yes        │ +Energy    │ Low         │ Medium       │ No
Task             │ Medium     │ Med  │ Yes          │ Yes        │ +Momentum  │ Medium      │ Medium       │ Rare (10%)
Focus Session    │ High       │ Med  │ Yes          │ High       │ +Momentum  │ High        │ High         │ Rare (15%)
Quest            │ High       │ High │ Yes          │ High       │ Neutral    │ High        │ High         │ Medium (35%)
Project          │ Epic       │ Epic │ Yes          │ Max        │ Max        │ Boss Defeat │ Max          │ Guaranteed
Milestone        │ Very High  │ High │ Yes          │ Very High  │ +Energy    │ Massive     │ Shield Break │ Guaranteed
Goal             │ Legendary  │ Max  │ Yes          │ Max        │ Max        │ Instant     │ Instant      │ Guaranteed
```

---

## 4. Progression Hierarchy & Canonical State Model

### 4.1 Progression Layers
- **Account Level (1–50):** Long-term breadth indicator unlocking new loadout slots, shop tiers, and high-tier project boss encounters.
- **Attributes (6 Core Capabilities):** Stable personal attributes mapped 1:1 with freelancer competencies:
  - Internal ID `intellect` → Freelancer Label: **Strategy & Craft**
  - Internal ID `discipline` → Freelancer Label: **Delivery & Execution**
  - Internal ID `focus` → Freelancer Label: **Deep Work & Attention**
  - Internal ID `power` → Freelancer Label: **Business & Negotiating Power**
  - Internal ID `agility` → Freelancer Label: **Adaptability & Speed**
  - Internal ID `willpower` → Freelancer Label: **Resilience & Recovery**
- **Domain Masteries (Ranks 0–10):** Domain-specific experience tracks (0 = Uninitiated, 10 = Legend) unlocking specialized passive domain perks.
- **Skill Points & Skill Trees:** Choice-driven combat/productivity moves unlocked via account level up.
- **Equipment Loadout:** 1 Identity Card, 1 Suit, 2 Gadgets, 1 Ally providing active/passive tactical modifiers.
- **Gold:** Earned currency spent exclusively in the custom Real-Life Reward Shop (e.g. coffee, gaming break, new gear).
- **Loot & Inventory:** Structural rewards (Suit Blueprints, Equipment Crafting Components, Cosmetic Badges).

### 4.2 Canonical V3 State Model Schema (JSON Schema v3)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "FreelancerLifeRPGStateV3",
  "type": "object",
  "required": [
    "schemaVersion",
    "profile",
    "progression",
    "resources",
    "loadout",
    "domains",
    "content",
    "encounter",
    "inventory",
    "ledger",
    "settings"
  ],
  "properties": {
    "schemaVersion": { "type": "integer", "const": 3 },
    "profile": {
      "type": "object",
      "required": ["id", "heroName", "createdAt", "updatedAt", "persona"],
      "properties": {
        "id": { "type": "string" },
        "heroName": { "type": "string" },
        "createdAt": { "type": "string" },
        "updatedAt": { "type": "string" },
        "persona": { "type": "string", "default": "freelancer_29" }
      }
    },
    "progression": {
      "type": "object",
      "required": ["level", "xp", "skillPoints", "attributes", "attributeXp"],
      "properties": {
        "level": { "type": "integer", "minimum": 1, "maximum": 50 },
        "xp": { "type": "integer", "minimum": 0 },
        "skillPoints": { "type": "integer", "minimum": 0 },
        "attributes": {
          "type": "object",
          "properties": {
            "intellect": { "type": "integer", "default": 10 },
            "discipline": { "type": "integer", "default": 10 },
            "focus": { "type": "integer", "default": 10 },
            "power": { "type": "integer", "default": 10 },
            "agility": { "type": "integer", "default": 10 },
            "willpower": { "type": "integer", "default": 10 }
          }
        },
        "attributeXp": {
          "type": "object",
          "properties": {
            "intellect": { "type": "integer", "default": 0 },
            "discipline": { "type": "integer", "default": 0 },
            "focus": { "type": "integer", "default": 0 },
            "power": { "type": "integer", "default": 0 },
            "agility": { "type": "integer", "default": 0 },
            "willpower": { "type": "integer", "default": 0 }
          }
        }
      }
    },
    "domains": {
      "type": "object",
      "properties": {
        "client_work": { "type": "object", "properties": { "rank": { "type": "integer" }, "xp": { "type": "integer" } } },
        "business_growth": { "type": "object", "properties": { "rank": { "type": "integer" }, "xp": { "type": "integer" } } },
        "craft": { "type": "object", "properties": { "rank": { "type": "integer" }, "xp": { "type": "integer" } } },
        "health": { "type": "object", "properties": { "rank": { "type": "integer" }, "xp": { "type": "integer" } } },
        "recovery": { "type": "object", "properties": { "rank": { "type": "integer" }, "xp": { "type": "integer" } } },
        "life_admin": { "type": "object", "properties": { "rank": { "type": "integer" }, "xp": { "type": "integer" } } },
        "relationships": { "type": "object", "properties": { "rank": { "type": "integer" }, "xp": { "type": "integer" } } }
      }
    },
    "resources": {
      "type": "object",
      "required": ["gold", "energy", "maxEnergy", "momentum", "maxMomentum", "stress", "maxStress"],
      "properties": {
        "gold": { "type": "integer", "minimum": 0 },
        "energy": { "type": "integer", "minimum": 0, "maximum": 100 },
        "maxEnergy": { "type": "integer", "default": 100 },
        "momentum": { "type": "integer", "minimum": 0, "maximum": 100 },
        "maxMomentum": { "type": "integer", "default": 100 },
        "stress": { "type": "integer", "minimum": 0, "maximum": 100 },
        "maxStress": { "type": "integer", "default": 100 }
      }
    },
    "loadout": {
      "type": "object",
      "required": ["identityId", "suitId", "gadgetIds", "allyId", "unlockedSkillIds"],
      "properties": {
        "identityId": { "type": "string", "default": "var_peter_parker" },
        "suitId": { "type": "string", "default": "classic_suit" },
        "gadgetIds": { "type": "array", "items": { "type": "string" }, "maxItems": 2 },
        "allyId": { "type": "string", "default": "mj" },
        "unlockedSkillIds": { "type": "array", "items": { "type": "string" } }
      }
    },
    "content": {
      "type": "object",
      "properties": {
        "habits": { "type": "array" },
        "dailies": { "type": "array" },
        "tasks": { "type": "array" },
        "focusSessions": { "type": "array" },
        "quests": { "type": "array" },
        "projects": { "type": "array" }
      }
    },
    "encounter": {
      "type": "object",
      "properties": {
        "activeProjectId": { "type": "string", "nullable": true },
        "villainId": { "type": "string", "nullable": true },
        "currentHp": { "type": "integer" },
        "maxHp": { "type": "integer" },
        "currentArmor": { "type": "integer" },
        "maxArmor": { "type": "integer" },
        "stagger": { "type": "integer" },
        "staggerThreshold": { "type": "integer" },
        "currentPhase": { "type": "integer", "default": 1 },
        "isStaggered": { "type": "boolean", "default": false }
      }
    },
    "inventory": {
      "type": "object",
      "properties": {
        "unlockedSuitIds": { "type": "array" },
        "unlockedGadgetIds": { "type": "array" },
        "unlockedAllyIds": { "type": "array" },
        "unlockedIdentityIds": { "type": "array" },
        "blueprints": { "type": "array" },
        "relics": { "type": "array" }
      }
    },
    "ledger": {
      "type": "array",
      "description": "Immutable log of completed actions for auditing and idempotency"
    },
    "settings": {
      "type": "object",
      "properties": {
        "soundEnabled": { "type": "boolean", "default": true },
        "theme": { "type": "string", "default": "dark_spidey" }
      }
    }
  }
}
```

---

## 5. Resource Model & Tactical State Controls

### 5.1 Resource Definitions & Rules

```text
┌──────────────┬──────────────┬─────────────────────────────┬─────────────────────────────┬───────────────────────────┐
│ Resource     │ Range        │ Primary Purpose             │ Earned / Increased By       │ Consumed / Decreased By   │
├──────────────┼──────────────┼─────────────────────────────┼─────────────────────────────┼───────────────────────────┤
│ Energy       │ 0 – 100      │ Fuel for high-focus work &  │ Sleep, Recovery actions,    │ High-difficulty tasks,    │
│              │              │ active skill triggers       │ Daily start reset (100)     │ Focus sessions (-15/ea)   │
├──────────────┼──────────────┼─────────────────────────────┼─────────────────────────────┼───────────────────────────┤
│ Momentum     │ 0 – 100      │ Flow-state multiplier for   │ Consecutive completions in  │ Daily reset (decays to 0),│
│              │              │ Stagger & Mastery XP gain   │ same day (+10 to +25)       │ Inactivity > 48h (-50)    │
├──────────────┼──────────────┼─────────────────────────────┼─────────────────────────────┼───────────────────────────┤
│ Stress       │ 0 – 100      │ Bounded burnout warning;    │ Overdue client deadlines,   │ Recovery domain actions,  │
│ (Burnout Meter)│            │ triggers Recovery Mode      │ 3+ consecutive heavy days   │ Sleep habit, weekend reset│
└──────────────┴──────────────┴─────────────────────────────┴─────────────────────────────┴───────────────────────────┘
```

### 5.2 Recovery Mode & Non-Punitive Grace
V3 explicitly eliminates punitive mechanics (such as losing progress, resetting level, or financial deductions). When Stress reaches 80+:
1. **Recovery Mode Triggered:** The system marks state as `RecoveryMode = true`.
2. **Tactical Shift:** High-intensity client tasks cost +50% Energy, while `recovery` and `health` domain actions grant **2.0x Mastery XP and +20 Energy**.
3. **No Punishment:** Streaks are never lost or broken. Completing 1 recovery action reduces Stress by 25 points.

---

## 6. Reward & Anti-Farming Engine Formula

### 6.1 Unified Master Reward Formula
Every verified action completion passes through the pure `RewardCalculator` module:

$$\text{AccountXP} = \text{BaseXP}(\text{Kind}) \times \text{DurationMult} \times \text{DiffMult} \times \text{ImpactMult} \times \text{UrgencyMult} \times \text{DecayMult} \times \text{BuildXpMult}$$

$$\text{Gold} = \text{BaseGold}(\text{Kind}) \times \text{DiffMult} \times \text{ImpactMult} \times \text{DecayMult} \times \text{BuildGoldMult}$$

$$\text{BossDamage} = \text{BaseDmg}(\text{Kind}) \times \text{DiffMult} \times \text{DomainMatchMult} \times \text{ArmorPenMult} \times \text{BuildDmgMult}$$

### 6.2 Parameter Tables

**1. Base Rewards by Action Kind:**
- `habit`: Base XP = 15, Base Gold = 5, Base Boss Damage = 0 (Stagger only = 10)
- `daily`: Base XP = 30, Base Gold = 10, Base Boss Damage = 25
- `task`: Base XP = 50, Base Gold = 15, Base Boss Damage = 50
- `focus_session`: Base XP = 80, Base Gold = 25, Base Boss Damage = 90
- `quest`: Base XP = 150, Base Gold = 50, Base Boss Damage = 180
- `milestone`: Base XP = 400, Base Gold = 150, Base Boss Damage = 500

**2. Duration Band Multipliers (`DurationMult`):**
- 0–15 min: 0.8x
- 16–30 min: 1.0x (Standard 25m Pomodoro baseline)
- 31–60 min: 1.4x
- 61–90 min: 1.8x
- 90+ min: 2.2x (Capped at 2.2x to encourage breaks)

**3. Difficulty Multipliers (`DiffMult`):**
- `easy`: 1.0x
- `medium`: 1.5x
- `hard`: 2.0x
- `epic`: 3.0x

**4. Impact Multipliers (`ImpactMult`):**
- `low` (Routine admin): 1.0x
- `medium` (Standard client work): 1.3x
- `high` (Key deliverable / sales pitch): 1.8x
- `critical` (Major contract launch): 2.5x

**5. Urgency Multiplier (`UrgencyMult`):**
- `normal`: 1.0x
- `due_today`: 1.15x
- `overdue`: 1.25x (Strictly capped at 1.25x to prevent intentional deadline stalling for rewards)

**6. Domain Matching Multiplier (`DomainMatchMult`):**
- Action Domain matches Boss Project Domain: **1.5x Boss Damage**
- Action Domain is unrelated to Boss Project: **0.2x Boss Damage** (Prevents farming unrelated habits to defeat a technical client boss)

### 6.3 Anti-Farming & Repetition Decay
To block macro/script spamming or tiny-task micro-grinding:
1. **Daily Domain Action Cap:** Maximum of 8 rewarded actions per domain per day. Actions 9+ yield 0 XP and 0 Gold.
2. **Repetition Decay (`DecayMult`):**
   - Completions 1–3 of identical habit/task in one day: 1.0x
   - Completions 4–6: 0.5x
   - Completions 7+: 0.1x
3. **Anti-Farm Proof Test:**
   - 50 Tiny Tasks (5 mins each, low impact): Hits daily cap after 8 tasks, total yield = ~200 XP, 40 Gold.
   - 1 Real 90-Minute Client Milestone (epic difficulty, high impact): Yields = 400 * 2.2 * 3.0 * 1.8 = **4,752 XP, 1,215 Gold, 3,240 Boss Damage**. Real work is mathematically superior by >20x.

---

## 7. Freelancer Campaign & Boss Encounter System

### 7.1 Client Project Mapped to Boss Encounter

```text
REAL FREELANCE CONTRACT                       GAMEPLAY BOSS ENCOUNTER
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│ Client: Acme Corp E-Commerce Build   │     │ Boss: Doctor Octopus (Tech Mastermind)│
│ Contract Value: $5,000               │ ──► │ HP: 3,000 | Armor: 600                │
│ Target Domain: client_work / craft   │     │ Weakness: Strategy & Craft (Intellect)│
└──────────────────────────────────────┘     └──────────────────────────────────────┘
                   │                                            │
                   ▼                                            ▼
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│ Deliverable 1: Database Architecture │ ──► │ Phase 1 Milestone Attack (750 HP)    │
│ Deliverable 2: Frontend Implementation│ ──► │ Phase 2 Milestone Attack (750 HP)    │
│ Deliverable 3: Payment Gateway & QA  │ ──► │ Phase 3 Milestone Attack (750 HP)    │
│ Final Signoff & Payment Settlement   │ ──► │ Final Finisher Move Unlocked & Defeat│
└──────────────────────────────────────┘     └──────────────────────────────────────┘
```

### 7.2 Encounter Phase Mechanics
Boss HP represents project scope. Boss Armor represents client complexity/revisions:
- **Armor Bypass:** Using actions with matching attributes (e.g. `intellect` for Doc Ock) bypasses 50% of Boss Armor.
- **Stagger Threshold:** Completing focus sessions accumulates Stagger points. When Stagger reaches 100%, the Boss is **Staggered** for 24 hours, taking **2.0x direct damage** and removing armor.
- **The Finisher Rule:** A Boss cannot be reduced below 1 HP by regular tasks. Defeating the Boss requires executing the **Final Milestone** of the project, which triggers the cinematic **Finisher Move** and awards the victory loot packet.

---

## 8. Unified Effect Engine Architecture

### 8.1 Declarative Effect Schema (`EffectDefinition`)
Every card, item, suit, skill, and ally modifier is defined using a standardized JSON schema:

```js
EffectDefinition = {
  id: "effect_advanced_suit_intellect_dmg",
  trigger: "ON_BOSS_ATTACK",         // Trigger timing
  target: "damage",                  // Modifier target parameter
  operation: "multiply",             // "add" | "multiply" | "override"
  value: 1.15,                       // Numeric modifier magnitude
  conditions: {                      // Requirements for effect activation
    domain: ["client_work", "craft"],
    attributes: ["intellect"],
    minMomentum: 20
  },
  limits: {
    maxPerDay: 5,                    // Cap on activations
    cooldownSeconds: 0
  },
  stackingRule: "cap",               // "stack" | "unique" | "cap"
  priority: 10,                      // Resolution order priority
  copy: {
    name: "Tactical Data Analysis",
    description: "+15% Boss Damage when executing Strategy & Craft tasks above 20 Momentum."
  }
}
```

### 8.2 Supported Engine Taxonomies

1. **Triggers:**
   - `PASSIVE_ALWAYS`: Evaluated continuously on state recalculation.
   - `ON_ACTION_COMPLETE`: Evaluated when an action is logged in the ledger.
   - `ON_FOCUS_SESSION_END`: Evaluated when a Pomodoro focus timer finishes.
   - `ON_BOSS_ATTACK`: Evaluated during Boss damage packet calculation.
   - `ON_DAY_START`: Evaluated at 08:00 daily reset.
   - `ON_DAY_END`: Evaluated at daily shutdown.

2. **Targets:**
   - `xp`, `gold`, `attribute_xp`, `mastery_xp`, `damage`, `stagger`, `energy`, `momentum`, `stress_reduction`, `loot_chance`.

3. **Resolution Order:**
   1. Base reward calculation from action formula;
   2. Collect active loadout `EffectDefinition` items matching trigger;
   3. Filter out effects failing conditional requirements;
   4. Group modifiers by target;
   5. Sum all `add` operations;
   6. Product all `multiply` operations (capped at global safety bounds);
   7. Apply final values to state transaction.

---

## 9. Card & Loadout System Architecture

### 9.1 Loadout Deck Structure
The player equips a tactical 5-slot loadout that dictates active passive bonuses and active focus abilities:

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 TODAY LOADOUT SLOTS                                     │
├───────────────────┬───────────────────┬───────────────────┬───────────────────┬─────────┤
│ 1. IDENTITY CARD  │ 2. SUIT           │ 3. GADGET SLOT 1  │ 4. GADGET SLOT 2  │ 5. ALLY │
│ Hero Archetype    │ Passive Armor/Perk│ Active Tech Tool  │ Active Tech Tool  │ Mentor  │
│ (e.g. Peter 616)  │ (e.g. Advanced 2.0)│ (e.g. Impact Web) │ (e.g. Spider Drone)│ (MJ)   │
└───────────────────┴───────────────────┴───────────────────┴───────────────────┴─────────┘
```

### 9.2 Mechanical vs Cosmetic Status
Every collectible card across all 5 arrays MUST be audited and categorized:
- **Mechanical Cards:** Contains at least 1 validated `EffectDefinition`. Interacts directly with the engine.
- **Cosmetic Cards:** Marked explicitly with `isCosmetic: true`. Grants visual theme customization or badge collection credit, with **zero fake stat claims**.

---

## 10. Balance Model & Global Caps

### 10.1 Numerical Balance Parameters
- **Account Level Curve (1–50):** $\text{XP}(L) = \lfloor 100 \times L^{1.6} \rfloor$. Level 50 total cumulative XP = ~520,000 XP (~6 months of consistent freelance work).
- **Attribute XP Soft Caps:** Levels 1–30 progress linearly. At level 30+, attribute gains apply a 0.5x soft cap multiplier. At level 45+, a 0.25x hard cap multiplier applies.
- **Mastery Ranks (0–10):** Requiring 500, 1200, 2500, 4500, 7500, 12000, 18000, 26000, 36000, 50000 Mastery XP.

### 10.2 Global Multiplier Safety Caps
To preserve economy integrity, the engine enforces strict hard ceiling caps regardless of build synergy stacking:

```text
┌───────────────────────────────────────┬────────────────────────┐
│ Target Multiplier                     │ Hard Ceiling Cap       │
├───────────────────────────────────────┼────────────────────────┤
│ XP Multiplier                         │ Max +50% (1.50x)       │
│ Gold Multiplier                       │ Max +50% (1.50x)       │
│ Boss Damage Multiplier                │ Max +75% (1.75x)       │
│ Boss Stagger Multiplier               │ Max +100% (2.00x)      │
│ Energy Efficiency (Cost Reduction)    │ Max -30%               │
└───────────────────────────────────────┴────────────────────────┘
```

---

## 11. Daily & Weekly UX Architecture

### 11.1 The "Home Command Center" Flow
The V3 main interface replaces complex menu hunting with a streamlined 5-question tactical briefing:

1. **What is the highest-value thing I should do now?** → Prominently featured **"Next Best Action"** card determined by deadline urgency, client impact, and current energy pool.
2. **What client/project is at risk?** → Active Boss Encounter widget displaying HP, Armor, Stagger progress, and deadline countdown.
3. **Do I need focus, business development, health or recovery?** → Domain Balance Indicator showing weekly percentage distribution across the 7 generic domains.
4. **What build effect is active and why?** → Active Loadout summary strip displaying current passive buffs and remaining gadget charges.
5. **What did I actually improve this week?** → Velocity widget showing total focus hours logged, revenue invoiced, and attribute growth.

---

## 12. Persistence & V2 → V3 Migration Architecture

### 12.1 Non-Destructive Migration Algorithm
When the V3 runtime loads an existing V2 localStorage snapshot (`schemaVersion: 2` or unversioned):

```js
function migrateV2ToV3(oldState) {
  // 1. Initialize Canonical V3 State Skeleton
  const newState = createCanonicalV3State();
  
  // 2. Transfer Immutable Profile Data
  newState.profile.id = oldState.profile?.id || 'hero_default';
  newState.profile.heroName = oldState.profile?.heroName || 'Peter Parker';
  newState.profile.createdAt = oldState.profile?.createdAt || new Date().toISOString();
  
  // 3. Migrate Account Progression & Attributes
  newState.progression.level = Math.min(50, Math.max(1, oldState.progression?.level || 1));
  newState.progression.xp = oldState.progression?.xp || 0;
  newState.progression.skillPoints = oldState.progression?.skillPoints || 0;
  
  // Direct 1:1 Mapping of Internal Attribute IDs
  const attrs = ['intellect', 'discipline', 'focus', 'power', 'agility', 'willpower'];
  attrs.forEach(attr => {
    newState.progression.attributes[attr] = oldState.progression?.attributes?.[attr] || 10;
    newState.progression.attributeXp[attr] = oldState.progression?.attributeXp?.[attr] || 0;
  });
  
  // 4. Map Legacy Masteries to 7 V3 Generic Domains
  newState.domains.client_work.xp = oldState.progression?.masteries?.deepWork || 0;
  newState.domains.health.xp = oldState.progression?.masteries?.fitness || 0;
  newState.domains.life_admin.xp = oldState.progression?.masteries?.discipline || 0;
  newState.domains.craft.xp = oldState.progression?.masteries?.learning || 0;
  
  // Recalculate Ranks for all domains based on XP
  Object.keys(newState.domains).forEach(dKey => {
    newState.domains[dKey].rank = calculateDomainRank(newState.domains[dKey].xp);
  });
  
  // 5. Migrate Resources safely
  newState.resources.gold = oldState.resources?.gold || 0;
  newState.resources.energy = Math.min(100, oldState.resources?.energy || 100);
  newState.resources.momentum = Math.min(100, oldState.resources?.momentum || 0);
  newState.resources.stress = 0; // Fresh stress baseline
  
  // 6. Migrate Loadout & Inventory
  newState.loadout.identityId = oldState.build?.identityId || 'var_peter_parker';
  newState.loadout.suitId = oldState.build?.equippedSuitId || 'classic_suit';
  newState.loadout.gadgetIds = Array.isArray(oldState.build?.equippedGadgetIds) 
    ? oldState.build.equippedGadgetIds.slice(0, 2) 
    : ['web_shooter'];
  newState.loadout.allyId = oldState.build?.companionId || 'mj';
  newState.loadout.unlockedSkillIds = oldState.build?.unlockedSkillIds || ['spider_sense'];
  
  // Preserve Unlocked Content Lists
  newState.inventory.unlockedSuitIds = oldState.inventory?.unlockedSuitIds || ['classic_suit', 'advanced_suit'];
  newState.inventory.unlockedGadgetIds = oldState.inventory?.unlockedGadgetIds || ['web_shooter', 'impact_web'];
  newState.inventory.unlockedAllyIds = oldState.inventory?.unlockedAllyIds || ['mj', 'aunt_may'];
  newState.inventory.unlockedIdentityIds = oldState.inventory?.unlockedIdentityIds || ['var_peter_parker', 'var_miles_morales'];
  
  // 7. Migrate Content Arrays with Generic Domain Tags
  newState.content.habits = (oldState.content?.habits || []).map(normalizeAction);
  newState.content.tasks = (oldState.content?.tasks || []).map(normalizeAction);
  newState.content.projects = (oldState.content?.projects || []).map(normalizeProject);
  
  // 8. Rebuild Immutable Action Ledger from History
  newState.ledger = oldState.ledger || [];
  
  // Set Schema Version 3
  newState.schemaVersion = 3;
  return newState;
}
```

---

## 13. Local Analytics & Balancing Without Backend

V3 includes an entirely client-side analytics module (`js/v3/analytics.js`) that computes local operational metrics to assist the freelancer in self-balancing workload without external server tracking:
- **Weekly Domain Ratio:** Distribution percentage of completed work across the 7 domains. Highlights neglected health or business growth.
- **Deep Work Yield:** Ratio of 45m+ focus sessions versus total completed tasks.
- **Burnout Velocity Index:** Rate of Stress accumulation per completed client project.
- **Build Impact Efficiency:** Percentage of total Boss damage produced by active build modifiers vs baseline rewards.

---

## 14. Authoritative Decision Log

1. **Canonical State Model:** Single JSON schema defined in Section 4.2 (`schemaVersion: 3`).
2. **Reward Formula:** Standardized formula in Section 6.1 with mandatory duration, difficulty, impact, and domain matching multipliers.
3. **Effect Resolution Pipeline:** 7-step deterministic evaluation order with hard ceiling safety caps (+50% XP/Gold, +75% Dmg).
4. **Loadout Deck:** Exactly 5 slots (1 Identity, 1 Suit, 2 Gadgets, 1 Ally).
5. **Internal Attribute Mapping:** Retains internal IDs (`intellect`, `discipline`, `focus`, `power`, `agility`, `willpower`) mapped to freelancer display labels for 100% save compatibility.
6. **Project Boss Mechanics:** Boss HP = Project Scope; Armor = Client Revisions; Defeat requires Final Milestone Finisher.
7. **Anti-Farming Rule:** Daily cap of 8 actions per domain + repetition decay (1.0x -> 0.5x -> 0.1x) + domain matching required for boss damage.
