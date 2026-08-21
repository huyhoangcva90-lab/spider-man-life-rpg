# V4 Information Architecture & Navigation Strategy

**Document Status:** Authoritative Information Architecture Specification  
**Navigation Model:** 5-Tier Hierarchical Structure (Desktop Rail + Mobile Bar)  
**Target User Persona:** 29-Year-Old Male Independent Freelancer  
**Primary Goal:** Eliminate nav clutter; replace 14-item sidebar with focused tactical workflows  

---

## 1. Information Architecture Principles & Reductions

### 1.1 The Flat Nav Failure Mode
The legacy V1–V3 interface suffered from a flat 14-item sidebar where Destinations like *Habits, Dailies, Tasks, Projects, Encounters, Suits, Skills, Gadgets, Allies, Map, Shop, Archive, Settings, Calibration* competed at equal visual weight. This created cognitive fatigue for a freelancer looking for quick operational focus.

### 1.2 The 5-Tier Canonical Structure
V4 consolidates all operations into **5 primary hierarchical sections**:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   V4 5-TIER PRIMARY NAVIGATION                                   │
├───────────────┬───────────────┬───────────────┬───────────────┬──────────────────────────────────┤
│ 1. COMMAND    │ 2. CAMPAIGNS  │ 3. BUILD      │ 4. ARCHIVE    │ 5. REVIEW                        │
│ Operational   │ Client        │ Character &   │ Verified      │ Retrospective,                   │
│ Station &     │ Project       │ Tactical      │ Spider-Verse  │ Reward Shop &                    │
│ Focus Core    │ Encounters    │ Loadout Deck  │ Catalog       │ Settings                         │
├───────────────┼───────────────┼───────────────┼───────────────┼──────────────────────────────────┤
│ • Home        │ • Projects    │ • Character   │ • Spider-Verse│ • Weekly Review                  │
│ • Today       │ • Encounters  │ • Loadout     │ • Suits       │ • Reward Shop                    │
│ • Focus Mode  │ • City Map    │ • Skill Web   │ • Gadgets     │ • System Settings                │
│               │               │               │ • Allies      │ • Legacy Switchboard             │
└───────────────┴───────────────┴───────────────┴───────────────┴──────────────────────────────────┘
```

---

## 2. Detailed Navigation Map & View Matrix

```text
ROOT ROUTE SYSTEM (#/view-name)
│
├── #/command (COMMAND CENTER)
│   ├── /home ───────────────► Evidence Board, Next Best Action, Web of Consequence, Loadout Bar
│   ├── /today ──────────────► Morning Briefing, Daily Commitment Checklist, Energy Allocation
│   └── /focus ──────────────► Super Focus Mode, Pomodoro Oscilloscope Timer, Single Task Telemetry
│
├── #/campaigns (CAMPAIGN & PROJECTS)
│   ├── /projects ───────────► Active Client Deliverables, Project Scope, Contract Values
│   ├── /encounters ─────────► Boss Encounter Telemetry (Doctor Octopus), HP/Armor, Phase Milestones
│   └── /map ────────────────► Real-World Spider City Map, District Client Encounters
│
├── #/build (TACTICAL DECK & SKILLS)
│   ├── /character ──────────► Account Level (1-50), 6 Core Attributes, Domain Mastery Ranks
│   ├── /loadout ────────────► 5-Slot Deck Manager (Identity, Suit, Gadget 1, Gadget 2, Ally)
│   └── /skills ─────────────► Skill Web Node Inspector & Skill Point Unlock Tree
│
├── #/archive (VERIFIED SPIDER-VERSE CATALOG)
│   ├── /spiderverse ────────► Verified Roster Cards (Peter, Miles, Gwen, 2099, Punk, Noir)
│   ├── /suits-gadgets ──────► Unlocked Suit & Gadget Gallery
│   └── /allies-villains ────► Unlocked Ally & Villain Dossiers
│
└── #/review (RETROSPECTIVE & SHOP)
    ├── /retrospective ──────► Weekly Velocity Telemetry & 7-Domain Balance Radar
    ├── /shop ───────────────► Real-Life Reward Shop (Custom freelancer rewards)
    └── /settings ───────────► Sound Toggle, Storage Diagnostics, V2/V3 Migration, Rollback Switch
```

---

## 3. Desktop Navigation Design (Left Tactical Rail + Header)

On desktop viewports (`≥ 1024px`), V4 renders a compact, high-density **Tactical Rail**:

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ [S] SPIDER-VERSE OPS       [⚡ 100 ENERGY]  [🔥 45 MOMENTUM]  [🪙 450 GOLD]  [⚙️ SETTINGS] │
├──────────────┬──────────────────────────────────────────────────────────────────────────┤
│ COMMAND      │ MAIN CONTENT VIEW (e.g. #/command/home)                                  │
│  ► Home      │                                                                          │
│    Today     │ ┌──────────────────────────────────────────────────────────────────────┐ │
│    Focus     │ │ EVIDENCE BOARD & NEXT BEST ACTION                                    │ │
│              │ └──────────────────────────────────────────────────────────────────────┘ │
│ CAMPAIGNS    │                                                                          │
│    Projects  │                                                                          │
│    Encounters│                                                                          │
│    Map       │                                                                          │
│              │                                                                          │
│ BUILD        │                                                                          │
│    Character │                                                                          │
│    Loadout   │                                                                          │
│    Skills    │                                                                          │
│              │                                                                          │
│ ARCHIVE      │                                                                          │
│    Catalog   │                                                                          │
│              │                                                                          │
│ REVIEW       │                                                                          │
│    Weekly    │                                                                          │
│    Shop      │                                                                          │
├──────────────┴──────────────────────────────────────────────────────────────────────────┤
│ [⚡ LAUNCH SUPER FOCUS ]                        [ ↺ SWITCH TO LEGACY V2/V3 SAVE DATA ]  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Width:** 220px fixed rail.
- **Visual Weight:** Dark slate paper texture (`--color-paper-card`) with cyan active indicator border.
- **Top Header Bar:** Sticky 48px header displaying active resource meters (Energy, Momentum, Gold) and status telemetry.

---

## 4. Mobile Navigation Design (Bottom Command Bar)

On mobile viewports (`< 768px`), V4 collapses the navigation rail into a **Bottom Tactical Dock**:

```text
┌────────────────────────────────────────────────────────┐
│ MOBILE VIEW CONTAINER                                  │
│                                                        │
│ (View Content Rendered Here)                           │
│                                                        │
├────────────────────────────────────────────────────────┤
│ BOTTOM TACTICAL DOCK                                   │
│ ┌──────────┬──────────┬──────────────┬──────────┬────┐ │
│ │ COMMAND  │CAMPAIGNS │ ⚡ FOCUS    │  BUILD   │MORE│ │
│ │  (Home)  │(Projects)│ (Quick Do)   │ (Loadout)│(≡) │ │
│ └──────────┴──────────┴──────────────┴──────────┴────┘ │
└────────────────────────────────────────────────────────┘
```

- **Bottom Dock Touch Targets:** 5 distinct targets (minimum 44px x 44px tap area).
- **Central Action Button:** Prominent cyan elevated button for **⚡ FOCUS / DO NEXT**, immediately launching Super Focus Mode on the highest-priority action.
- **Off-Canvas Drawer:** The `MORE (≡)` button slides up an off-canvas sheet containing Archive, Review, Settings, and Legacy Migration controls.

---

## 5. Contextual State Overlay Strategy

V4 ensures navigation state is never lost when inspecting items or executing tasks. Sub-views layer cleanly over primary navigation using **Contextual Drawers & Modals**:

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ BASE VIEW LAYER (#/archive/spiderverse)                                                 │
│ (Grid of 18 verified card face thumbnails)                                             │
│                                                                                         │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │ OVERLAY DRAWER (CARD DETAIL INSPECTOR)                                            │  │
│  │ Slide-in panel displaying canonical provenance, effect formula, & loadout button │  │
│  │ • URL hash updates to #/archive/spiderverse?inspect=v4_2099                        │  │
│  │ • Closing drawer restores background scroll position instantly without page reload │  │
│  └───────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Transparent Reward Breakdown Modal:** Triggered on action completion; presents exact math breakdown before returning to Home/Focus view.
2. **Tactical Loadout Picker Drawer:** Triggered from Home or Build views; allows 1-tap card swapping without leaving the current workflow.
3. **Super Focus Telemetry Screen:** Full-screen overlay providing distraction-free Pomodoro execution with a single 1-tap exit button (`ESC` or top-right `X`).

---

## 6. Architecture Acceptance Checklist

- [x] Flat 14-item sidebar completely replaced by 5-tier primary hierarchy.
- [x] Complete hash-based route map defined for Command, Campaigns, Build, Archive, and Review.
- [x] Desktop 220px Left Tactical Rail layout specified.
- [x] Mobile Bottom Tactical Dock layout specified with central Focus trigger.
- [x] Overlay drawer and modal navigation state rules defined.
