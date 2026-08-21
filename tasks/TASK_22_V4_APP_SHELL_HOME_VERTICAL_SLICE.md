# TASK 22: V4 App Shell & Home Command Center Vertical Slice

# OBJECTIVE

Implement Milestone 1 and Milestone 2 of the V4 rebuild plan: establish the isolated `app-v4/` codebase, the token-based visual design system (Split Physical/Digital Evidence Board), the responsive 5-tier App Shell navigation, the V4 StateStore with LocalStorage persistence (`schemaVersion: 4`), and the functional Home Command Center vertical slice.

Do not touch or modify legacy V1–V3 files (`app.js`, `styles.css`, `index.html`, etc.).

# TARGET USER & STACK

- **Target Persona:** 29-Year-Old Male Independent Freelancer.
- **Tech Stack:** HTML5, Vanilla CSS (Design Tokens), Vanilla JavaScript (ES Modules), LocalStorage.
- **Location:** `app-v4/` isolated directory.

# SCOPE & REQUIREMENTS

### 1. Isolated Directory Setup
Create the clean directory structure for V4:
```text
app-v4/
├── index.html
├── css/
│   ├── tokens.css
│   ├── base.css
│   ├── components.css
│   └── views.css
└── js/
    ├── main.js
    ├── config/constants.js
    ├── core/
    │   ├── StateStore.js
    │   ├── StorageRepository.js
    │   └── EventBus.js
    ├── engine/
    │   └── RewardCalculator.js
    ├── data/
    │   └── InitialState.js
    └── ui/
        ├── ShellView.js
        └── HomeView.js
```

### 2. Design Tokens (`css/tokens.css` & `css/base.css`)
Implement the visual design system tokens:
- **Colors:**
  - `--color-paper-base`: `#111318` (Dark slate field report base)
  - `--color-paper-card`: `#1A1D24` (Dossier card panel)
  - `--color-ink-primary`: `#F0F3F8` (Primary typography)
  - `--color-ink-muted`: `#8A94A6` (Muted telemetry labels)
  - `--color-spider-red`: `#E62429` (Red acetate overlay accent)
  - `--color-spider-cyan`: `#00D2FF` (Cyan oscilloscope wave accent)
  - `--color-gold-warning`: `#F5A623` (Reward gold & stress accent)
- **Typography:** Display (`Space Grotesk` / `-apple-system`), Body (`Inter` / `system-ui`), Telemetry (`JetBrains Mono` / `monospace`).
- **Layout & Scale:** Spacing baseline grid (`4px, 8px, 12px, 16px, 24px, 32px`), Radius policy (`3px` paper tags, `6px` cards), Shadow/Borders.

### 3. Responsive App Shell (`js/ui/ShellView.js`)
- **5-Tier Navigation Hierarchy:**
  1. `Command` (#/command)
  2. `Campaigns` (#/campaigns)
  3. `Build` (#/build)
  4. `Archive` (#/archive)
  5. `Review` (#/review)
- **Desktop (≥ 1024px):** 220px Left Tactical Rail + Sticky Top Telemetry Bar.
- **Mobile (< 768px):** Bottom Tactical Dock with 5 touch targets + central `⚡ FOCUS` button.

### 4. V4 Core Store & LocalStorage Repository (`js/core/StateStore.js`)
- Implement reactive StateStore wrapping `schemaVersion: 4` canonical JSON state.
- Automatically save state changes to key `spidey_v4_state` in LocalStorage.
- Provide initial fallback seed data with 3 sample freelancer actions (e.g., *Deliver Database Schema*, *Client Lead Generation Call*, *Morning Hydration & Mobility*).

### 5. Home Command Center View (`js/ui/HomeView.js`)
Build the functional Home screen answering *"What should I do next, and why does it matter?"*:
1. **Next Best Action Card:** Displays the highest-value pending task with duration, domain tag, reward XP, and direct `[COMPLETE TASK]` trigger button.
2. **Active Boss Encounter Widget:** Renders Doctor Octopus summary with HP gauge (2,250 / 3,000 HP), Armor gauge (600 / 600 Armor), and Stagger progress bar.
3. **Web of Consequence Widget:** Displays tactical link: `[Selected Action] ──► [Domain: client_work] ──► [Attribute: +15 Intellect] ──► [Boss Damage: +220 Dmg]`.
4. **Today Loadout Summary Strip:** Displays equipped cards (`Peter Parker`, `Advanced Suit 2.0`, `Web-Shooter`, `Impact Web`, `Mary Jane`).

### 6. Action Execution & Reward Breakdown Modal
- Clicking `[COMPLETE TASK]` on the Next Best Action card invokes `RewardCalculator.js`.
- Opens transparent breakdown dialog showing base rewards, duration multiplier, domain match bonus, and resulting Boss damage.
- Commits completed task to `ledger`, updates resource meters, deals damage to Doc Ock HP, and saves state.

---

# STEP-BY-STEP IMPLEMENTATION PLAN

1. **Step 1:** Create `app-v4/` directory structure and CSS design system files (`tokens.css`, `base.css`, `components.css`, `views.css`).
2. **Step 2:** Build `js/config/constants.js` and `js/data/InitialState.js` with `schemaVersion: 4` default data.
3. **Step 3:** Implement `js/core/StorageRepository.js`, `js/core/StateStore.js`, and `js/core/EventBus.js`.
4. **Step 4:** Implement `js/engine/RewardCalculator.js` pure formula engine.
5. **Step 5:** Create `js/ui/ShellView.js` featuring Desktop left rail and Mobile bottom dock navigation.
6. **Step 6:** Create `js/ui/HomeView.js` featuring Evidence Board layout, Next Best Action card, Boss encounter gauge, and Web of Consequence matrix.
7. **Step 7:** Implement task completion reward modal and state update flow.
8. **Step 8:** Assemble `app-v4/index.html` launcher and `js/main.js` ES module bootstrap. Verify layout and interaction locally in browser.

---

# ACCEPTANCE CRITERIA

- `app-v4/index.html` loads cleanly in the browser as a standalone ES module application.
- Visual design strictly reflects the Split Evidence Board aesthetic using specified color tokens and typography.
- Desktop view displays left tactical rail (5 primary sections); Mobile view displays bottom dock.
- Home screen clearly displays the Next Best Action, active Boss encounter telemetry, Web of Consequence matrix, and Loadout strip.
- Clicking `[COMPLETE TASK]` opens transparent reward breakdown modal, calculates XP/Gold/Damage, updates state, and persists to `spidey_v4_state` in LocalStorage.
- Legacy V1–V3 code (`js/app.js`, `styles.css`, root `index.html`) is completely untouched.

# DO NOT

- Do not modify files outside `app-v4/` or `tasks/`.
- Do not import legacy JS scripts or CSS into `app-v4/`.
- Do not build complex full-archive card drawers or V2 save migration importers in Task 22 (deferred to later milestones).
