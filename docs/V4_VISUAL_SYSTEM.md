# V4 Visual System & Design Architecture

**Document Status:** Authoritative Visual Design Contract  
**Design Direction:** Split Physical/Digital Evidence Board with Dimensional Spider-Verse Overlays  
**Target User Persona:** 29-Year-Old Male Independent Freelancer  
**Primary Aesthetic Goal:** Mature, disciplined, tactical operations station without dark SaaS clichés  

---

## 1. Visual Philosophy & Design Subject

### 1.1 The Design Subject
The design direction is **Peter Parker’s mature freelance operations station intersecting with a fractured Spider-Verse**.

Materials and visual metaphors:
- **Field Reports & Dossiers:** Off-white/slate paper textures, typewriter/mono labels, pinned photo contact sheets, clipboards, and high-legibility client notes representing real-life freelancer discipline.
- **Dimensional Acetate Overlays:** Red acetate translucent maps, cyan oscilloscope signal traces, spider-web structural guidelines, and suit telemetry monitors cutting cleanly through the field reports.
- **Dimensional Portal Refraction:** Luminous Spider-Verse portal edges appearing strictly around active project encounters, loadout calibration, and skill web nodes.

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                            SPLIT PHYSICAL/DIGITAL EVIDENCE BOARD                            │
│                                                                                             │
│  ┌─────────────────────────────────────────┐  ┌──────────────────────────────────────────┐  │
│  │   FIELD REPORT / DOSSIER BASE LAYER     │  │    DIMENSIONAL OVERLAY TELEMETRY LAYER   │  │
│  │  • Off-white / dark slate paper background│  │  • Cyan oscilloscope signal wave (#00F0FF)│  │
│  │  • Crisp typography & structured cards  │  │  • Crimson acetate map grid (#FF1E42)    │  │
│  │  • Client scope & daily focus tasks     │  │  • Boss stagger & loadout suit telemetry │  │
│  └─────────────────────────────────────────┘  └──────────────────────────────────────────┘  │
│                                             ▲                                               │
│                                             │                                               │
│                            LINKED VIA "WEB OF CONSEQUENCE"                                  │
│             [Today's Action] ──► [Client Project] ──► [Attribute] ──► [Boss Impact]         │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Aesthetic Risk: Split Physical/Digital Evidence Board
Rather than choosing between a plain white document app or a glowing cyberpunk dashboard, V4 combines both:
1. **Productivity Content:** Reads like disciplined, clean field reports and client dossiers.
2. **Encounter & Build Content:** Cuts through field reports with luminous cyan/red Spider-Verse acetate telemetry.
3. **Web of Consequence Visualization:** A signature visual element linking today's action directly to:
   - Client Project / Boss targeted;
   - Core Attribute trained (`intellect`, `discipline`, etc.);
   - Active Card Synergy (Suit / Skill / Gadget buff);
   - Direct Boss Damage & Stagger dealt.

### 1.3 Forbidden Cliché Checklist (Strictly Prohibited)
- ❌ **No Generic Dark SaaS Dashboard:** No dark gray `#121212` backgrounds with floating neon cards.
- ❌ **No Constant Neon Borders:** No glowing violet/pink outline boxes around passive text containers.
- ❌ **No Emoji Navigation:** No placing random emojis (`🎯`, `⚔️`, `🚀`, `💪`) in primary sidebars.
- ❌ **No Overuse of Glassmorphism:** No translucent blurred backdrops on primary text content that reduces readability.
- ❌ **No Headline Biscuit Pills:** No pill badges with pulsing dots placed directly above primary headers.
- ❌ **No CSS Gradient Keywords:** No multi-color gradient fills applied across headline typography text.
- ❌ **No Particle Mesh Overlays / Grid Backgrounds:** No cheesy matrix/particle animations running in the background.
- ❌ **No Over-Nested Cards:** No rounded cards containing 3+ nested cards inside.

---

## 2. Design System Tokens

### 2.1 Color Palette (7 Core Tokens)

| Token Name | Hex Value | HSL Value | Semantic Role |
| :--- | :--- | :--- | :--- |
| `--color-paper-base` | `#111318` | `220deg 17% 8%` | Deep slate field report surface background |
| `--color-paper-card` | `#1A1D24` | `220deg 16% 12%` | Field report card container & dossier panel |
| `--color-ink-primary` | `#F0F3F8` | `220deg 25% 96%` | Primary high-contrast typography & labels |
| `--color-ink-muted` | `#8A94A6` | `220deg 14% 60%` | Muted field report notes & secondary telemetry |
| `--color-spider-red` | `#E62429` | `359deg 79% 52%` | Accent: Red acetate map grid, suit energy, critical damage |
| `--color-spider-cyan` | `#00D2FF` | `191deg 100% 50%` | Accent: Cyan oscilloscope telemetry, focus timers, web lines |
| `--color-gold-warning` | `#F5A623` | `37deg 91% 55%` | Secondary accent: Reward shop gold, project urgency, stress |

### 2.2 Typography Specification

| Role | Font Family | Fallback Stack | Size / Line-Height | Tracking / Weight |
| :--- | :--- | :--- | :--- | :--- |
| **Display Header** | `Cabinet Grotesk` | `'Inter', -apple-system, sans-serif` | `28px / 34px` | `-0.02em` / `700 Bold` |
| **Section Header** | `Space Grotesk` | `'Trebuchet MS', sans-serif` | `20px / 26px` | `-0.01em` / `600 SemiBold` |
| **Body Content** | `Inter` | `system-ui, sans-serif` | `14px / 20px` | `0em` / `400 Regular` |
| **Telemetry / Code**| `JetBrains Mono` | `'Courier New', monospace` | `12px / 16px` | `+0.03em` / `500 Medium` |

### 2.3 Spacing Scale & Radius Policy

```css
/* CSS Token Definitions */
:root {
  /* Spacing Scale (4px baseline grid) */
  --space-2xs: 4px;
  --space-xs:  8px;
  --space-sm:  12px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;
  --space-2xl: 48px;

  /* Corner Radius Policy */
  --radius-sm:   3px;   /* Precise paper dossier tag radius */
  --radius-md:   6px;   /* Default card & button corner radius */
  --radius-lg:   12px;  /* Modal drawer & large evidence board radius */
  --radius-full: 9999px;/* Tactical status pills strictly */

  /* Elevation & Borders */
  --border-dossier: 1px solid rgba(255, 255, 255, 0.08);
  --border-active:  1px solid var(--color-spider-cyan);
  --border-alert:   1px solid var(--color-spider-red);
  --shadow-dossier: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-glow-cyan: 0 0 12px rgba(0, 210, 255, 0.25);

  /* Motion Curves */
  --ease-tactical: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-base: 250ms;
}
```

### 2.4 Iconography & Image Rules
1. **Zero Emojis:** Iconography uses clean SVG symbols exclusively (`<svg>` symbol library embedded in shell).
2. **Aspect Ratios:**
   - Card Faces: **`2:3` aspect ratio** (e.g. `240px x 360px`).
   - Character Portraits: **`1:1` aspect ratio** square crops with centered focal point (`50% 25%`).
   - Project Dossier Banners: **`16:5` landscape ratio**.
3. **Card Face Simplicity:** Every card face displays **Image + Canonical Name only**. All stat formulas, cooldowns, and mechanical descriptions appear strictly in the Detail Drawer / Loadout Inspector.

---

## 3. Compact ASCII Wireframes

### 3.1 Desktop Home Command Center

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [S] SPIDER-VERSE OPERATIONS COMMAND   │ STATUS: ACTIVE  │ ENERGY: 100/100  │ STRESS: 15/100 │ GOLD: 450      │
├─────────────────┬───────────────────────────────────────────────────────────────────────────────────────────┤
│ COMMAND         │ DAILY BRIEFING: 3 ACTIONS PENDING                                [SETTINGS] [MIGRATE]     │
│  ► Home         ├─────────────────────────────────────────┬─────────────────────────────────────────────────┤
│    Today        │ NEXT BEST ACTION                        │ ACTIVE BOSS ENCOUNTER                           │
│    Focus        │ ┌─────────────────────────────────────┐ │ ┌─────────────────────────────────────────────┐ │
│                 │ │ [CLIENT_WORK] Deliver DB Schema     │ │ │ BOSS: DOCTOR OCTOPUS (Acme E-Commerce)      │ │
│ CAMPAIGNS       │ │ Priority: Critical | Est: 45 min    │ │ │ HP: 2,250 / 3,000 [█████████████░░░░░] 75%   │ │
│    Projects     │ │ Rewards: +180 XP, +45 Gold, +220 Dmg│ │ │ ARMOR: 600/600   | STAGGER: 45/100        │ │
│    Encounters   │ │ [EXECUTE TASK]   [START FOCUS TIMER]│ │ │ Weakness: Strategy & Craft (Intellect)        │ │
│    Map          │ └─────────────────────────────────────┘ │ └─────────────────────────────────────────────┘ │
│                 ├─────────────────────────────────────────┴─────────────────────────────────────────────────┤
│ BUILD           │ WEB OF CONSEQUENCE (TODAY'S TACTICAL MATRIX)                                             │
│    Character    │ ┌───────────────────────────────────────────────────────────────────────────────────────┐ │
│    Loadout      │ │ [Selected: DB Schema] ──► Domain: client_work ──► Attribute: +15 Intellect XP         │ │
│    Skill Web    │ │ └──► Synergy: Advanced Suit (+15% Dmg) + Web-Shooter (Bypasses 300 Boss Armor)       │ │
│                 │ └───────────────────────────────────────────────────────────────────────────────────────┘ │
│ ARCHIVE         ├───────────────────────────────────────────────────────────────────────────────────────────┤
│    Spider-Verse │ TODAY LOADOUT SUMMARY                                                                     │
│    Suits/Gadgets│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│                 │ │ IDENTITY     │ │ SUIT         │ │ GADGET 1     │ │ GADGET 2     │ │ ALLY         │      │
│ REVIEW          │ │ Peter Parker │ │ Advanced 2.0 │ │ Web-Shooter  │ │ Impact Web   │ │ Mary Jane    │      │
│    Retrospective│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘      │
└─────────────────┴───────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Mobile Home View

```text
┌──────────────────────────────────────────┐
│ [S] SPIDER-VERSE OPS      ⚡100   🪙450   │
├──────────────────────────────────────────┤
│ NEXT BEST ACTION                         │
│ ┌──────────────────────────────────────┐ │
│ │ [CLIENT_WORK] Deliver DB Schema      │ │
│ │ Est: 45m | +180 XP | +220 Dmg        │ │
│ │ [ EXECUTE ]       [ FOCUS TIMER ]    │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ACTIVE BOSS                              │
│ ┌──────────────────────────────────────┐ │
│ │ DOCTOR OCTOPUS (Acme E-Commerce)     │ │
│ │ HP: 2250/3000   ARMOR: 600/600       │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ TODAY LOADOUT                            │
│ [Peter] [Advanced 2.0] [Web-Shooter] >   │
├──────────────────────────────────────────┤
│ [COMMAND] [CAMPAIGNS] (FOCUS) [BUILD] [=]│
└──────────────────────────────────────────┘
```

### 3.3 Today / Focus Flow

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ SUPER FOCUS MODE :: TELEMETRY OSCILLOSCOPE ACTIVE                                      [EXIT FOCUS MODE (X)]│
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                             │
│                                      CURRENT FOCUS TARGET                                                   │
│                                 Deliver Database Schema & Migrations                                        │
│                                      Domain: client_work (Client Delivery)                                  │
│                                                                                                             │
│                                       [ 24 : 58 ]                                                           │
│                                  FOCUS POMODORO TIMER                                                       │
│                                                                                                             │
│   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/^^\~~~~~~~~~~~~~~~~~~/\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   │
│   [CYAN SIGNAL TELEMETRY WAVEFORM :: FOCUS STABILITY 98.4% :: MOMENTUM +15 BUFF ACTIVE]                    │
│                                                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │ ACTIVE MODIFIERS: Advanced Suit 2.0 (+15% Boss Damage) | Web-Shooter Charge Ready                    │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                             │
│                      [ PAUSE TIMER ]                  [ COMPLETE & REWARD ]                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Loadout Screen

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ BUILD :: TODAY TACTICAL LOADOUT                                                  SKILL POINTS AVAILABLE: 2 │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ EQUIPPED SLOTS (5 DECK SLOTS)                                                                               │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                        │
│ │ IDENTITY     │ │ SUIT         │ │ GADGET 1     │ │ GADGET 2     │ │ ALLY         │                        │
│ │ Peter Parker │ │ Advanced 2.0 │ │ Web-Shooter  │ │ Impact Web   │ │ Mary Jane    │                        │
│ │ Affinity:    │ │ Passive:     │ │ Active (2/2):│ │ Active (1/1):│ │ Support:     │                        │
│ │ client_work  │ │ +15% Boss Dmg│ │ Bypass Armor │ │ +50% Stagger │ │ +20% Gold    │                        │
│ │ [ CHANGE ]   │ │ [ CHANGE ]   │ │ [ CHANGE ]   │ │ [ CHANGE ]   │ │ [ CHANGE ]   │                        │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘                        │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ACTIVE SYNERGY SUMMARY                                                                                      │
│ • Domain Affinity: client_work (+10% Base XP on technical deliverables)                                     │
│ • Boss Armor Bypass: 300 armor ignored on next 2 task completions                                           │
│ • Daily Gold Multiplier: 1.20x applied to all business_growth completions                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.5 Archive Gallery + Large Card Inspector

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ SPIDER-VERSE ARCHIVE :: VERIFIED CATALOG (18 ITEMS)                           FILTER: [ ALL | SPIDER-PERSON ]│
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ GALLERY GRID (VERIFIED CARD FACES: IMAGE + NAME ONLY)                                                       │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│ │ [IMG: PETER]│ │ [IMG: MILES]│ │ [IMG: GWEN] │ │ [IMG: 2099] │ │ [IMG: PUNK] │ │ [IMG: NOIR] │             │
│ │ Peter Parker│ │ Miles Morales│ │ Ghost-Spider│ │ Spidey 2099 │ │ Spider-Punk │ │ Spidey Noir │             │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘             │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ CARD INSPECTOR DRAWER (TRIGGERED ON CLICK)                                                                  │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ CARD DETAILS: SPIDER-MAN 2099 (Miguel O'Hara)                              STATUS: VERIFIED (OFFICIAL)  │ │
│ │ ┌───────────────────┐ Provenance: Spider-Man 2099 #1 (1992) / Local Verified Asset                     │ │
│ │ │                   │ Archetype: Technical Innovator & System Architect                                 │ │
│ │ │   HIGH-RES ART    │ Mechanical Role: Identity Card                                                    │ │
│ │ │   VERIFIED CROP   │ Effect Rule: +25% Attribute XP gained on 'craft' and 'intellect' actions.         │ │
│ │ │                   │ Lore: Directs futuristic web tech to optimize freelancer workflow systems.        │ │
│ │ └───────────────────┘ [ EQUIP TO LOADOUT ]                                      [ CLOSE INSPECTOR ]     │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.6 Project / Boss Encounter Screen

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CAMPAIGNS :: CLIENT PROJECT DOSSIER                                                                         │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PROJECT: Acme Corp E-Commerce Platform Redesign                                   CONTRACT VALUE: $5,000    │
│ TARGET DOMAIN: client_work (Client Delivery)                                      DEADLINE: 14 DAYS REMAINING│
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ENCOUNTER TELEMETRY :: DOCTOR OCTOPUS (Tech Mastermind)                                                     │
│ HP:    2,250 / 3,000 [██████████████████████████░░░░░░░░░] 75%                                              │
│ ARMOR:   600 /   600 [███████████████████████████████████] 100% (Requires Intellect / Web-Shooter to Bypass)  │
│ STAGGER:  45 /   100 [███████████████░░░░░░░░░░░░░░░░░░░░] 45%  (Focus sessions deal +25 Stagger)           │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PROJECT MILESTONES (DELIVERABLES)                                                                          │
│ 1. [COMPLETED] Database Architecture & Schema Design         ──► Phase 1 Damage Dealt (-750 HP)            │
│ 2. [ACTIVE]    Frontend Payment Gateway & Checkout Integration ──► Phase 2 Milestone Attack Target          │
│ 3. [LOCKED]    Final Client QA, Security Audit & Handover     ──► Phase 3 Finisher Move Target             │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ LOG DELIVERABLE TASK ]           [ RUN FOCUS SESSION ]           [ ATTACK WITH LOADOUT GADGET ]           │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.7 Weekly Review Screen

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ REVIEW :: WEEKLY RETROSPECTIVE & STRATEGY CALIBRATION                            WEEK 32 :: AUG 07 - AUG 13│
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ OPERATIONAL VELOCITY TELEMETRY                                                                              │
│ • Total Actions Completed: 28 tasks    • Deep Work Focused: 18.5 hours    • Invoiced Revenue: $2,400        │
│ • Account XP Gained: 14,250 XP         • Reward Gold Earned: +620 Gold      • Boss Damage Dealt: 4,800 HP    │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DOMAIN BALANCE RADAR (7 DOMAIN DISTRIBUTION)                                                                │
│ client_work:    ██████████████████ 45% (High)        health:       ████ 10% (Balanced)                     │
│ business_growth:██████ 15% (Balanced)                recovery:     ██ 5% (⚠️ LOW - BURNOUT RISK)           │
│ craft:          ██████ 15% (Balanced)                relationships:██ 5% (Low)                              │
│ life_admin:     ████ 10% (Balanced)                  [ STRATEGY ADVICE: Schedule 2 Recovery Sessions ]      │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ REAL-LIFE REWARD SHOP                                                                                       │
│ ┌───────────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────┐                 │
│ │ Specialty Coffee Break    │ │ New Mechanical Keyboard   │ │ Friday Gaming Evening     │                 │
│ │ Cost: 150 Gold            │ │ Cost: 1,200 Gold          │ │ Cost: 400 Gold            │                 │
│ │ [ CLAIM REWARD ]          │ │ [ CLAIM REWARD ]          │ │ [ CLAIM REWARD ]          │                 │
│ └───────────────────────────┘ └───────────────────────────┘ └───────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Visual System Acceptance Checklist

- [x] Aesthetic risk established: Split physical/digital evidence board with dimensional Spider-Verse layers.
- [x] Web of Consequence visualization defined.
- [x] Complete 7-token color palette with exact hex and HSL values.
- [x] Typography, radius, elevation, motion, and icon rules specified.
- [x] 7 compact ASCII wireframes created for Desktop, Mobile, Focus, Loadout, Archive, Boss, and Review screens.
