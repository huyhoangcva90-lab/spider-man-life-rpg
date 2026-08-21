# V4 Implementation Roadmap & Phased Execution Plan

**Document Status:** Authoritative Development Roadmap  
**Target Architecture:** Local-First, HTML5, Vanilla CSS, Vanilla JavaScript (ES Modules), localStorage  
**Isolation Scope:** Isolated `app-v4/` directory with non-destructive V2/V3 migration  
**Target Persona:** 29-Year-Old Male Independent Freelancer  

---

## 1. Master Rebuild Strategy & Phased Timeline

To ensure rapid delivery, high stability, and zero risk to existing user save data, V4 is executed across **8 focused milestones**. Each milestone delivers a testable, self-contained increment with explicit exit criteria and strict non-goals.

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       V4 IMPLEMENTATION ROADMAP                                         │
├───────────┬───────────┬───────────┬───────────┬───────────┬───────────┬───────────┬─────────────────────┤
│ M1        │ M2        │ M3        │ M4        │ M5        │ M6        │ M7        │ M8                  │
│ Foundation│ Home/Focus│ Reward    │ Character │ Projects  │ Archive   │ Map, Audio│ Migration, Balancing│
│ & Shell   │ Vertical  │ Engine &  │ & Loadout │ & Bosses  │ Catalog   │ & Visual  │ & Final Cutover     │
│           │ Slice     │ Breakdown │ Deck      │           │           │ Polish    │                     │
└───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴─────────────────────┘
```

---

## 2. Detailed Milestone Specifications

### Milestone 1: Foundation, Tokens, Shell, Repository & Sample Data
- **Objective:** Establish the isolated `app-v4/` directory, design token CSS system, base App Shell layout (Desktop Tactical Rail + Mobile Dock), StateStore, LocalStorage repository, and seed sample data.
- **Deliverables:**
  1. Directory structure under `app-v4/` (`css/`, `js/`, `assets/v4/`).
  2. `css/tokens.css` containing 7 core color tokens, typography scale, spacing variables, and elevate/border rules.
  3. `js/core/StateStore.js` and `js/core/StorageRepository.js` supporting `schemaVersion: 4`.
  4. `js/ui/ShellView.js` implementing Desktop rail and Mobile dock navigation.
  5. Isolated `app-v4/index.html` entry point.
- **Exit Criteria:** Loading `app-v4/index.html` in browser displays clean navigation shell, renders correct tokens, and initializes default V4 state in `localStorage` without errors.
- **Explicit Non-Goals:** No complex reward formulas, no boss encounter engine, no live V2/V3 data migration.

---

### Milestone 2: Home / Today / Focus Vertical Slice
- **Objective:** Build the core operational interface answering *"What should I do next, and why does it matter?"*
- **Deliverables:**
  1. `js/ui/HomeView.js`: Split Evidence Board rendering Next Best Action card, active project summary, and Web of Consequence preview.
  2. `js/ui/FocusView.js`: Super Focus Mode screen with Pomodoro countdown timer (25m/45m) and cyan oscilloscope waveform visualization.
  3. Action Completion Trigger allowing 1-tap task marking with basic XP/Gold feedback.
- **Exit Criteria:** User can select a task on Home, launch Focus Mode, let the timer run or complete it, and observe immediate account XP/Gold update.
- **Explicit Non-Goals:** No full 5-slot loadout deck picker, no complex skill trees, no sound FX library.

---

### Milestone 3: Reward & Effect Engine with Explainable Breakdown Panel
- **Objective:** Implement pure, deterministic math engine (`RewardCalculator.js` and `EffectEngine.js`) and transparent breakdown modal.
- **Deliverables:**
  1. `js/engine/RewardCalculator.js`: Pure mathematical evaluation of Duration, Difficulty, Impact, Urgency, Domain Match, and Repetition Decay multipliers.
  2. `js/engine/EffectEngine.js`: Declarative loadout modifier resolver enforcing global hard ceiling caps (+50% XP/Gold, +75% Dmg, +100% Stagger).
  3. `js/ui/components/RewardModal.js`: Transparent modal showing exact formula breakdown upon task completion.
- **Exit Criteria:** Every completed action opens a modal showing explicit math step-by-step (`Base XP * Duration * Impact * Card Buff = Final XP`).
- **Explicit Non-Goals:** No gacha card unlocks, no random loot drops, no card click progression.

---

### Milestone 4: Character & Loadout System with Small Verified Roster
- **Objective:** Build 5-slot tactical deck manager (Identity, Suit, Gadget 1, Gadget 2, Ally) backed by the 18 verified launch items.
- **Deliverables:**
  1. `js/data/VerifiedRoster.js`: 18 verified launch roster declarations matching asset policy.
  2. `js/ui/BuildView.js`: Character progression view displaying Account Level (1-50), 6 Attributes, and 7 Domain Mastery ranks.
  3. `js/ui/components/LoadoutPicker.js`: 5-slot deck manager allowing card swapping with live active perk summary updating.
- **Exit Criteria:** Equipping Advanced Suit 2.0 or Web-Shooter dynamically modifies the calculation in the Reward Modal on the next completed task.
- **Explicit Non-Goals:** No unverified remote card images, no gallery stat grinding.

---

### Milestone 5: Projects, Boss Encounters, and Loot Settlement
- **Objective:** Connect client deliverables to Boss encounters (Doctor Octopus) with HP scope, Armor revisions, Stagger flow, and victory loot settlement.
- **Deliverables:**
  1. `js/engine/BossEngine.js`: Boss HP reduction, armor bypass logic (Strategy/Intellect tasks & Web-Shooters), and Pomodoro stagger accumulation.
  2. `js/ui/CampaignsView.js`: Project Boss Dossier panel displaying Doctor Octopus status gauge, phase milestones, and finisher move button.
  3. Milestone loot settlement granting custom Gold for the Real-Life Reward Shop.
- **Exit Criteria:** Completing a client_work task deals targeted damage to Doc Ock, bypasses armor when using matching intellect attributes, and triggers stagger at 100 stagger points.
- **Explicit Non-Goals:** No multi-boss raid mechanics, no complex procedural enemy AI.

---

### Milestone 6: Archive Expansion & Asset Manifest Verification
- **Objective:** Deliver read-only Spider-Verse Archive gallery for build discovery and card inspection.
- **Deliverables:**
  1. `js/ui/ArchiveView.js`: Clean grid displaying verified card face thumbnails (Image + Name only).
  2. Card Detail Inspect Drawer showing official provenance, archetype lore, and mechanical effect definitions.
  3. Local asset manifest validator verifying local file paths under `assets/v4/`.
- **Exit Criteria:** User can browse all 18 verified cards, click any card to open the inspect drawer, and verify zero direct stat points or rewards are granted on card clicks.
- **Explicit Non-Goals:** No unverified remote images, no web scraping, no paywalled card packs.

---

### Milestone 7: Map, Audio Telemetry & Visual FX Polish
- **Objective:** Incorporate interactive Spider City map telemetry, audio sound effects (web zip, focus start, boss damage), and visual animations.
- **Deliverables:**
  1. `js/ui/MapView.js`: Clean SVG Spider City map showing district client project pins.
  2. Audio Telemetry Manager (`js/core/AudioManager.js`) with sound toggle setting.
  3. CSS micro-animations for oscilloscope wave, acetate red map overlays, and Web of Consequence links.
- **Exit Criteria:** Interface plays crisp web zip audio on task completion (when sound is enabled) and highlights city map project nodes smoothly.
- **Explicit Non-Goals:** No heavy WebGL 3D rendering engines, no external audio streaming.

---

### Milestone 8: V2 Migration, Economy Balancing, and Cutover
- **Objective:** Finalize client-side analytics, non-destructive V2/V3 importer, root switchboard redirect, and 1-click rollback emergency toggle.
- **Deliverables:**
  1. `js/domain/MigrationService.js`: Importer reading legacy save data and mapping to `schemaVersion: 4` without modifying original keys.
  2. Root `index.html` switchboard launcher routing to `app-v4/index.html`.
  3. Emergency Rollback Switchboard banner in Settings allowing instant return to legacy V2/V3 app.
- **Exit Criteria:** Launching root app opens V4; user can import V2/V3 save data cleanly; 1-click rollback returns user to legacy app instantly with zero data loss.
- **Explicit Non-Goals:** No database migration server tools, no breaking legacy file deletions.

---

## 3. Roadmap Acceptance Checklist

- [x] 8 small, distinct milestones defined in logical sequence.
- [x] Each milestone includes explicit Objectives, Deliverables, Exit Criteria, and Non-Goals.
- [x] Clear isolation strategy maintained through Milestone 8.
- [x] Non-destructive V2/V3 migration and emergency rollback placed in final cutover milestone.
