# V4 Product Rebuild Blueprint & Core Architecture

**Document Status:** Authoritative Architectural Blueprint & System Specification  
**Target User Persona:** 29-Year-Old Male Independent Freelancer  
**Product Identity:** Spider-Verse Freelancer Operations RPG (V4 Rebuild)  
**Target Stack:** Local-First, HTML5, Vanilla CSS, Vanilla JavaScript (ES Modules), localStorage  
**Target Location:** Dedicated isolated directory (`app-v4/`)  

---

## 1. Executive Summary & Strategic Intent

### 1.1 The Core Problem
The current Life RPG application (V1–V3) has accumulated significant structural debt:
- **Visual Hierarchy Degradation:** Screens suffer from noisy, inconsistent visual weight, flat 14-item navigation sidebars, generic dark SaaS themes, and uncoordinated card layouts.
- **Asset Integrity Failure:** Remote images frequently depict the wrong character (e.g., generic Spider-Man artwork placed on Spider-Gwen or Spider-Man 2099 cards) or lack provenance.
- **Detached Gameplay Mechanics:** Collectibles (Suits, Skills, Gadgets, Allies) exist largely as gallery counters without transparent, deterministic, or explainable effects on daily real-world productivity actions.
- **Fragmented User Experience:** The product feels like a disjointed assembly of isolated modules (Habits, Dailies, Tasks, Maps, Galleries) rather than a unified freelancer command station.

### 1.2 The Strategic Solution (V4 Clean Rebuild)
Rather than patching broken legacy code, V4 executes a clean, isolated rebuild. 
- **Zero Legacy Code Pollution:** Legacy V2/V3 application files will remain untouched in the root directory as a reference and save-data source. All V4 code will reside in an isolated `app-v4/` directory.
- **Productivity-First Core Loop:** Every card, animation, and sound in V4 strictly serves real-world freelance execution. No button clicks or gallery interactions award durable progress.
- **Disciplined Evidence-Board Aesthetics:** V4 introduces a split physical/digital evidence-board visual direction: crisp field-report productivity tools intersected by luminous Spider-Verse dimensional telemetry.

---

## 2. Product Benchmark Audit (4 Reference Systems)

We analyzed four primary product references against official documentation and user feedback to define explicit **Adopt** and **Avoid** architectural decisions for V4.

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   REFERENCE PRODUCT COMPARISON MATRIX                                       │
├─────────────────┬──────────────────────────────────────────┬────────────────────────────────────────────────┤
│ Reference       │ Adopted Principles & Systems             │ Rejected Trope / Failure Modes                 │
├─────────────────┼──────────────────────────────────────────┼────────────────────────────────────────────────┤
│ 1. Habitica     │ • Immediate XP/Gold feedback loop        │ • Punitive missed-daily health damage/death    │
│                 │ • Equipment & loadout modifiers          │ • Cluttered legacy UI and multi-column noise   │
│                 │ • Clear Task / Daily / Habit taxonomy    │ • Fantasy RPG theme detached from work         │
├─────────────────┼──────────────────────────────────────────┼────────────────────────────────────────────────┤
│ 2. LifeUp       │ • Customizable Attribute XP & Masteries  │ • Configuration overload (100+ menus)          │
│                 │ • Focus/Pomodoro reward integration      │ • Detached counters without core gameplay loop │
│                 │ • Real-life reward shop integration      │ • Arbitrary stat grinding                      │
├─────────────────┼──────────────────────────────────────────┼────────────────────────────────────────────────┤
│ 3. Finch        │ • Achieveable daily purpose & energy     │ • Childlike companion tone and pet mechanics   │
│                 │ • Supportive non-punitive recovery mode  │ • Soft aesthetic unsuitable for 29yo persona   │
│                 │ • Low-friction daily planning flow       │ • Lack of serious project combat mechanics     │
├─────────────────┼──────────────────────────────────────────┼────────────────────────────────────────────────┤
│ 4. Amazing      │ • Single "Next Best Action" focus mode   │ • Overwhelming initial options (100+ strategies)│
│    Marvin       │ • Sequential project deliverable mapping │ • Complex hidden settings dependency trees     │
│                 │ • Structured daily planning & shutdown   │ • Generic corporate SaaS design style          │
└─────────────────┴──────────────────────────────────────────┴────────────────────────────────────────────────┘
```

### 2.1 Habitica Analysis
- **Sources:** `https://habitica.com/static/features`, `https://habitica.com/static/faq`
- **Adopt:** Strict taxonomy separating repeatable habits, scheduled dailies, and one-off tasks; immediate feedback on completion; loadout items providing active mechanical stats.
- **Avoid:** Health loss / daily damage for missed tasks. For a 29-year-old freelancer with fluctuating client loads, punitive daily damage creates shame, avoidance, and app abandonment. V4 replaces health penalties with bounded **Stress / Recovery Mode**.

### 2.2 LifeUp / ulives Analysis
- **Sources:** `https://docs.lifeupapp.fun/zh-cn/`, `https://app.ulives.io/`
- **Adopt:** Core Attribute XP tracking mapped to real life skills (Strategy, Execution, Deep Work, Business Power); earning Gold spent in a custom Real-Life Reward Shop (coffee, breaks, gear).
- **Avoid:** Configuration overload. LifeUp requires users to build complex formulas from scratch. V4 provides pre-tuned, opinionated freelancer domain models out of the box.

### 2.3 Finch Analysis
- **Sources:** `https://help.finchcare.com/hc/en-us/articles/37935669335309-Our-Approach-to-Self-Care`, `https://help.finchcare.com/hc/en-us/articles/37780134479757-Energy-vs-Rainbow-Stones`
- **Adopt:** Energy as a daily purpose resource; gentle, non-judgmental recovery mechanics when burnout strikes; structured morning briefing and evening shutdown ritual.
- **Avoid:** Infant-like companion tone. A 29-year-old freelancer requires a sleek, high-tech tactical operations command center—not a tamagotchi pet care application.

### 2.4 Amazing Marvin Analysis
- **Source:** `https://help.amazingmarvin.com/en/collections/1139197-strategies`
- **Adopt:** "Super Focus Mode" providing single-task clarity; sequential project encounter breakdowns; tactical daily planning that filters noise down to 3–5 key commitments.
- **Avoid:** Option paralysis. Marvin exposes dozens of strategy flags at once. V4 encapsulates strategies into equipping specific **Suits, Gadgets, and Allies**.

---

## 3. System Input Audit (`FREELANCER_LIFE_RPG_SYSTEM_V3.md`)

We performed a critical audit of the V3 design document to preserve valid decisions and eliminate contradictions or excessive complexity.

### 3.1 Preserved V3 Decisions
1. **7 Generic Freelancer Domains:** `client_work`, `business_growth`, `craft`, `health`, `recovery`, `life_admin`, `relationships`.
2. **6 Core Freelancer Attributes:** Strategy & Craft (`intellect`), Delivery & Execution (`discipline`), Deep Work (`focus`), Business Power (`power`), Resilience & Speed (`agility`), Burnout Recovery (`willpower`).
3. **Deterministic Math Engine:** Base rewards multiplied by Duration, Difficulty, Impact, Urgency, Domain Matching, and Repetition Decay.
4. **Hard Ceiling Safety Caps:** Hard limits on build synergy stacking (+50% XP/Gold, +75% Boss Damage, +100% Stagger).
5. **5-Slot Tactical Loadout Deck:** 1 Identity Card, 1 Suit, 2 Gadgets, 1 Ally.
6. **Bounded Recovery Mode:** High stress triggers double XP for health/recovery tasks with zero progress loss or streak breaks.
7. **Non-Destructive Schema Migration:** Clean conversion algorithm from V2/V3 storage schemas to V4.

### 3.2 Corrected & Simplified V3 Flaws
1. **Card Click & Gallery Exploit Elimination:** In V3, clicking card galleries could trigger stat pops or mock rewards. V4 strictly isolates the Archive as a read-only discovery viewer. Progress is 100% gated behind real-world action ledger entries.
2. **Character & Asset Misalignment:** V3 referenced hundreds of cards with placeholder remote URLs that rendered incorrect characters. V4 enforces a strict **Verified Launch Roster** of 18 items backed by local verified assets.
3. **Flat Navigation Removal:** V3 retained a 14-item sidebar. V4 reduces navigation to a 5-tier primary hierarchy (**Command, Campaigns, Build, Archive, Review**).
4. **Text Artifact & Contradiction Fixes:** V3 contained legacy encoding bugs (mojibake) and conflicting statements regarding project HP vs milestone finishing moves. V4 unifies project progress: Boss HP equals remaining task weight, and Boss Armor equals client revision friction.

---

## 4. V4 Core Product Thesis & Gameplay Loop

### 4.1 Product Thesis
> **"The product is Peter Parker’s mature freelance operations station intersecting with a fractured Spider-Verse."**

The Home screen has exactly **one job**: Answer *"What should I do next, and why does it matter?"*

### 4.2 The Canonical Gameplay Loop

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     THE V4 CANONICAL LOOP                                        │
│                                                                                                  │
│ 1. DAILY BRIEFING     ──► Review schedule, inspect active Boss encounter, set Today Loadout      │
│ 2. CHOOSE LOADOUT     ──► Equip 1 Identity, 1 Suit, 2 Gadgets, 1 Ally to match today's focus     │
│ 3. EXECUTE ACTION     ──► Complete real-world client task, deep work session, or health habit    │
│ 4. REWARD BREAKDOWN   ──► Inspect transparent calculation (Base * Multipliers * Card Effects)     │
│ 5. ENCOUNTER ADVANCE  ──► Deal targeted Boss Damage / Armor Bypass based on domain match        │
│ 6. BUILD STRENGTHEN   ──► Level Account, gain Attribute XP, unlock verified Suits & Skills       │
│ 7. WEEKLY REVIEW      ──► Audit domain balance, evaluate velocity, adjust tactical strategy      │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Gameplay Content Roles Matrix

| Category | Primary Mechanical Role | Acquisition / Rule |
| :--- | :--- | :--- |
| **Identity Card** | Defines core build archetype and domain affinity (e.g., Peter Parker = Client Work / Intellect bonus). | Selected at profile setup or unlocked via Account Level milestones. |
| **Suit** | Provides 1 permanent primary passive rule active throughout the day. | Unlocked via Project Boss victories & blueprint crafting. |
| **Skill** | Purchased permanent rule or action conversion (e.g., Focus sessions deal +25% Stagger). | Unlocked using Skill Points earned on Account Level Up. |
| **Gadget** | Limited-use tactical modifier consumed when executing specific real actions (e.g., Web-Shooter: bypasses Boss Armor 2x/day). | Equippable in 2 slots; charges reset daily during Morning Briefing. |
| **Ally** | Support rule with specific activation condition or cooldown (e.g., MJ: +20% Gold on Business Growth tasks). | Unlocked via Relationship domain milestones. |
| **Villain / Boss** | Real client project embodiment with HP (scope), Armor (revisions), and Phase Milestones. | Created when launching a major real-world client contract or personal quest. |
| **Spider-Verse Archive**| Read-only collection gallery & build strategy discovery system. | **Never grants direct rewards or stat points on click.** |

---

## 5. Rebuild Architecture & Migration Isolation Strategy

To guarantee that legacy V2/V3 code is never accidentally loaded or broken, V4 operates under strict directory isolation.

### 5.1 Directory Structure (`app-v4/`)

```text
mysterious-kepler/
├── index.html                       # Root launcher (Switchboard redirect / V4 entry point)
├── assets/                          # Shared media assets & images
│   └── v4/                          # Clean, verified V4 asset manifest directory
│       ├── cards/                   # Verified card face images (2:3 aspect ratio)
│       ├── characters/              # Verified portrait renders
│       └── UI/                      # Acetate textures, icons, web SVGs
├── app-v4/                          # DEDICATED ISOLATED V4 APPLICATION DIRECTORY
│   ├── index.html                   # V4 standalone HTML entry point
│   ├── css/
│   │   ├── tokens.css               # Design system variables (colors, typography, spacing)
│   │   ├── base.css                 # Reset, typography defaults, evidence-board paper texture
│   │   ├── components.css           # Cards, buttons, loadout slots, dossier panels
│   │   └── views.css                # View-specific layouts (Home, Focus, Build, Archive)
│   └── js/
│       ├── main.js                  # App bootstrap & view router
│       ├── config/
│       │   └── constants.js         # Global caps, domain mappings, version strings
│       ├── core/
│       │   ├── StateStore.js        # Immutability wrapper & pub/sub store
│       │   ├── StorageRepository.js # LocalStorage adapter with schema versioning
│       │   └── EventBus.js          # Decoupled application event bus
│       ├── engine/
│       │   ├── RewardCalculator.js  # Pure formula engine (XP, Gold, Boss Damage)
│       │   ├── EffectEngine.js      # Declarative loadout modifier resolver
│       │   └── BossEngine.js        # Boss HP, Armor, Stagger, Phase logic
│       ├── domain/
│       │   ├── ActionService.js     # Habit/Daily/Task completion orchestration
│       │   ├── ProjectService.js    # Client project & Boss encounter management
│       │   └── MigrationService.js  # Non-destructive V2/V3 -> V4 state converter
│       ├── data/
│       │   ├── VerifiedRoster.js    # Verified launch cards, suits, skills, gadgets
│       │   └── InitialState.js      # Clean default V4 state schema
│       └── ui/
│           ├── ShellView.js         # Top command bar & primary 5-section nav rail
│           ├── HomeView.js          # Evidence Board, Next Best Action, Web of Consequence
│           ├── FocusView.js         # Super Focus Mode & Oscilloscope Pomodoro timer
│           ├── BuildView.js         # Loadout deck manager & Skill Web inspect
│           ├── CampaignsView.js     # Project boss encounters & map telemetry
│           ├── ArchiveView.js       # Verified Spider-Verse card gallery & inspect modal
│           ├── ReviewView.js        # Weekly retrospective & Real-Life Reward Shop
│           └── components/
│               ├── RewardModal.js   # Transparent breakdown dialog
│               └── LoadoutPicker.js # 5-slot tactical deck selector
└── docs/                            # System blueprints, visual guides, asset policies
```

### 5.2 Module Boundaries & Strict Dependency Rules
1. **No Circular Imports:** Modules strictly import downwards: `ui` -> `domain` -> `engine` -> `core` -> `config`.
2. **Pure Math Engine:** `RewardCalculator.js` and `EffectEngine.js` are 100% pure functions with zero DOM or localStorage side effects. They take `(action, loadout, state)` and return `{ xp, gold, bossDamage, breakdown }`.
3. **Unidirectional Data Flow:** UI components dispatch actions to `StateStore`. `StateStore` updates immutable state, persists to `StorageRepository`, and notifies subscriber views.

### 5.3 Canonical V4 State Schema (`schemaVersion: 4`)

```json
{
  "schemaVersion": 4,
  "profile": {
    "id": "hero_v4_001",
    "heroName": "Peter Parker",
    "createdAt": "2026-08-13T00:00:00.000Z",
    "persona": "freelancer_29"
  },
  "progression": {
    "level": 1,
    "xp": 0,
    "skillPoints": 0,
    "attributes": {
      "intellect": 10,
      "discipline": 10,
      "focus": 10,
      "power": 10,
      "agility": 10,
      "willpower": 10
    },
    "attributeXp": {
      "intellect": 0, "discipline": 0, "focus": 0,
      "power": 0, "agility": 0, "willpower": 0
    }
  },
  "domains": {
    "client_work": { "rank": 1, "xp": 0 },
    "business_growth": { "rank": 1, "xp": 0 },
    "craft": { "rank": 1, "xp": 0 },
    "health": { "rank": 1, "xp": 0 },
    "recovery": { "rank": 1, "xp": 0 },
    "life_admin": { "rank": 1, "xp": 0 },
    "relationships": { "rank": 1, "xp": 0 }
  },
  "resources": {
    "gold": 100,
    "energy": 100,
    "maxEnergy": 100,
    "momentum": 0,
    "maxMomentum": 100,
    "stress": 0,
    "maxStress": 100,
    "isRecoveryMode": false
  },
  "loadout": {
    "identityId": "v4_peter_parker",
    "suitId": "v4_suit_classic",
    "gadgetIds": ["v4_gadget_web_shooter", "v4_gadget_impact_web"],
    "allyId": "v4_ally_mj",
    "equippedSkillIds": ["v4_skill_spider_sense"]
  },
  "unlocked": {
    "identityIds": ["v4_peter_parker"],
    "suitIds": ["v4_suit_classic", "v4_suit_advanced"],
    "gadgetIds": ["v4_gadget_web_shooter", "v4_gadget_impact_web"],
    "allyIds": ["v4_ally_mj"],
    "skillIds": ["v4_skill_spider_sense", "v4_skill_web_strike"]
  },
  "actions": {
    "habits": [],
    "dailies": [],
    "tasks": [],
    "projects": []
  },
  "activeEncounter": {
    "projectId": null,
    "villainId": "v4_boss_doc_ock",
    "currentHp": 3000,
    "maxHp": 3000,
    "currentArmor": 600,
    "maxArmor": 600,
    "stagger": 0,
    "staggerThreshold": 100,
    "isStaggered": false
  },
  "ledger": [],
  "settings": {
    "soundEnabled": true,
    "theme": "evidence_board_spiderverse"
  }
}
```

### 5.4 V2/V3 Import & Migration Isolation Policy
1. **Isolation Guard:** `app-v4/` JS modules never load or parse legacy `js/app.js` or `styles.css`.
2. **Explicit Migration Trigger:** When a user launches V4, the application starts with fresh V4 sample data or clean state. Migration is **never forced automatically**.
3. **Non-Destructive Importer (`MigrationService.js`):**
   - Reads `localStorage.getItem('freelancer_life_rpg_state')` or legacy save keys.
   - Validates existence of V2/V3 data.
   - Maps legacy attributes 1:1, converts legacy mastery XP into the 7 V4 domains, and maps unlocked items to nearest verified V4 launch roster IDs.
   - Writes result to `localStorage.setItem('spidey_v4_state', ...)` while **preserving the original V2/V3 key untouched**.
4. **Cutover & Rollback Mechanism:**
   - The root `index.html` serves as a version switchboard.
   - By default, `index.html` loads `app-v4/index.html` via clean iframe or script bootstrap.
   - An emergency banner in Settings allows 1-click fallback: `window.location.href = '/index.html?legacy=true'`, instantly restoring access to the legacy V2/V3 interface without data loss.

---

## 6. Architecture Acceptance Checklist

- [x] Four reference products analyzed with explicit adopt/avoid criteria.
- [x] V3 system input audited; contradictions, mojibake, and card exploits removed.
- [x] Single canonical loop defined (`Briefing -> Loadout -> Execute -> Breakdown -> Encounter -> Growth -> Review`).
- [x] 5-tier navigation structure established (**Command, Campaigns, Build, Archive, Review**).
- [x] Completely isolated directory structure (`app-v4/`) defined.
- [x] Non-destructive state migration and 1-click rollback plan specified.
- [x] No application code modified in V1-V3 legacy files.
