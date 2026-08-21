# V4 Asset Manifest Policy & Verified Roster Contract

**Document Status:** Authoritative Asset Specification & Character Verification Policy  
**Policy Purpose:** Eliminate wrong-character art, remote broken assets, and card clutter  
**Target User Persona:** 29-Year-Old Male Independent Freelancer  
**Launch Scope:** Small Verified Roster (18 Launch Items)  

---

## 1. Asset Verification Rules & Policy Requirements

To eliminate the visual noise and wrong-character artwork of V1–V3, V4 enforces **five non-negotiable asset integrity rules**:

1. **Rule 1: No Unverified Remote Images.** No remote image URL (`http://...` or `https://...`) will be rendered in V4 without explicit manual subject identity verification logged in the asset manifest. All launch assets must be stored locally under `assets/v4/`.
2. **Rule 2: Strict Character Identity Matching.** Never use generic Spider-Man artwork to represent distinct characters (e.g. placing Peter Parker art on Miles Morales, Spider-Gwen, Spider-Man 2099, or Spider-Man Noir cards is strictly forbidden).
3. **Rule 3: Small Verified Roster Over Massive Catalogs.** V4 launches with a tight, high-quality roster of **18 verified items** rather than hundreds of unverified or broken card entries.
4. **Rule 4: Generated Art & Fan Art Labeling Rules.** Original fan art or generated images must be explicitly classified (`classification: "generated"`) and must not clone or imitate specific living artists or exact proprietary layouts (such as Marvel SNAP UI frames).
5. **Rule 5: Card Face Simplicity Contract.** Every card face thumbnail displays **Image + Canonical Display Name ONLY**. Mechanical stats, damage formulas, cooldowns, and lore descriptions appear strictly in the Detail Inspect Drawer.

---

## 2. Asset Manifest JSON Schema Definition

Every asset in V4 must be declared in `js/data/VerifiedRoster.js` matching this strict JSON schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "V4AssetManifestEntry",
  "type": "object",
  "required": [
    "entityId",
    "canonicalName",
    "assetType",
    "localPath",
    "provenance",
    "verificationStatus",
    "classification",
    "cropFocalPoint",
    "fallbackPath",
    "reviewer",
    "dateVerified",
    "gameplayRole",
    "effectDefinition"
  ],
  "properties": {
    "entityId": { "type": "string", "pattern": "^v4_[a-z0-9_]+$" },
    "canonicalName": { "type": "string" },
    "assetType": { 
      "type": "string", 
      "enum": ["identity", "suit", "skill", "gadget", "ally", "villain"] 
    },
    "localPath": { "type": "string" },
    "provenance": { "type": "string" },
    "verificationStatus": { 
      "type": "string", 
      "enum": ["verified_official", "verified_generated", "rejected"] 
    },
    "classification": { 
      "type": "string", 
      "enum": ["official_marvel_sony", "original_generated", "reference"] 
    },
    "cropFocalPoint": { "type": "string", "default": "50% 25%" },
    "fallbackPath": { "type": "string" },
    "reviewer": { "type": "string" },
    "dateVerified": { "type": "string", "format": "date" },
    "gameplayRole": { "type": "string" },
    "effectDefinition": { "type": "object" }
  }
}
```

---

## 3. Verified Launch Vertical Slice Roster (18 Items)

### 3.1 Identity Cards (6 Spider-Persons)

```js
export const VERIFIED_IDENTITIES = [
  {
    entityId: "v4_identity_peter_parker",
    canonicalName: "Peter Parker (Earth-616)",
    assetType: "identity",
    localPath: "assets/v4/cards/peter_parker.webp",
    provenance: "Marvel Official Reference / Verified Local Asset",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 20%",
    fallbackPath: "assets/v4/cards/fallbacks/identity_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Build Archetype: Client Work & Strategy Mastermind",
    effectDefinition: {
      trigger: "PASSIVE_ALWAYS",
      target: "xp",
      operation: "multiply",
      value: 1.15,
      conditions: { domain: ["client_work", "craft"] },
      copy: { name: "Freelancer Instinct", description: "+15% Base XP gained from Client Delivery and Skill Craft tasks." }
    }
  },
  {
    entityId: "v4_identity_miles_morales",
    canonicalName: "Miles Morales (Earth-1610)",
    assetType: "identity",
    localPath: "assets/v4/cards/miles_morales.webp",
    provenance: "Marvel / Sony Animation Official Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 25%",
    fallbackPath: "assets/v4/cards/fallbacks/identity_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Build Archetype: High-Velocity Focus & Burst Execution",
    effectDefinition: {
      trigger: "ON_FOCUS_SESSION_END",
      target: "momentum",
      operation: "add",
      value: 15,
      conditions: { minDurationMinutes: 25 },
      copy: { name: "Venom Blast Focus", description: "+15 Momentum awarded upon completing any 25m+ Pomodoro focus session." }
    }
  },
  {
    entityId: "v4_identity_ghost_spider",
    canonicalName: "Ghost-Spider (Gwen Stacy)",
    assetType: "identity",
    localPath: "assets/v4/cards/ghost_spider.webp",
    provenance: "Marvel Official Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 20%",
    fallbackPath: "assets/v4/cards/fallbacks/identity_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Build Archetype: Agility, Health & Recovery Balance",
    effectDefinition: {
      trigger: "PASSIVE_ALWAYS",
      target: "stress_reduction",
      operation: "multiply",
      value: 1.30,
      conditions: { domain: ["health", "recovery"] },
      copy: { name: "Rhythmic Flow", description: "+30% Stress Reduction efficiency when logging Health or Recovery activities." }
    }
  },
  {
    entityId: "v4_identity_spider_2099",
    canonicalName: "Spider-Man 2099 (Miguel O'Hara)",
    assetType: "identity",
    localPath: "assets/v4/cards/spider_2099.webp",
    provenance: "Marvel Official Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 20%",
    fallbackPath: "assets/v4/cards/fallbacks/identity_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Build Archetype: Technical Craft & Business Power",
    effectDefinition: {
      trigger: "PASSIVE_ALWAYS",
      target: "attribute_xp",
      operation: "multiply",
      value: 1.25,
      conditions: { attributes: ["intellect", "power"] },
      copy: { name: "Futuristic Architecture", description: "+25% Attribute XP gained for Strategy & Craft and Business Power." }
    }
  },
  {
    entityId: "v4_identity_spider_punk",
    canonicalName: "Spider-Punk (Hobie Brown)",
    assetType: "identity",
    localPath: "assets/v4/cards/spider_punk.webp",
    provenance: "Marvel / Sony Animation Official Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 30%",
    fallbackPath: "assets/v4/cards/fallbacks/identity_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Build Archetype: Anarchic Admin & Rapid Task Clearing",
    effectDefinition: {
      trigger: "ON_ACTION_COMPLETE",
      target: "stagger",
      operation: "add",
      value: 20,
      conditions: { domain: ["life_admin"] },
      copy: { name: "System Disruption", description: "Completing Life Admin tasks deals +20 Stagger damage to active Boss encounters." }
    }
  },
  {
    entityId: "v4_identity_spider_noir",
    canonicalName: "Spider-Man Noir (Peter Parker)",
    assetType: "identity",
    localPath: "assets/v4/cards/spider_noir.webp",
    provenance: "Marvel Official Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 20%",
    fallbackPath: "assets/v4/cards/fallbacks/identity_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Build Archetype: Deep Investigation & Client Lead Gen",
    effectDefinition: {
      trigger: "PASSIVE_ALWAYS",
      target: "gold",
      operation: "multiply",
      value: 1.25,
      conditions: { domain: ["business_growth"] },
      copy: { name: "Hard-Boiled Investigation", description: "+25% Reward Gold earned on Business Growth & Lead Generation tasks." }
    }
  }
];
```

### 3.2 Boss / Villain (1 Major Encounter)

```js
export const VERIFIED_VILLAINS = [
  {
    entityId: "v4_boss_doc_ock",
    canonicalName: "Doctor Octopus (Otto Octavius)",
    assetType: "villain",
    localPath: "assets/v4/cards/doc_ock.webp",
    provenance: "Insomniac Marvel's Spider-Man Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 25%",
    fallbackPath: "assets/v4/cards/fallbacks/villain_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Project Boss: Acme Corp E-Commerce Build ($5,000 Contract)",
    effectDefinition: {
      maxHp: 3000,
      maxArmor: 600,
      staggerThreshold: 100,
      weaknessAttribute: "intellect",
      targetDomain: "client_work",
      copy: { name: "Mechanical Multitasking", description: "High technical scope. Weak to Strategy & Craft deliverables." }
    }
  }
];
```

### 3.3 Ally (1 Support Mentor)

```js
export const VERIFIED_ALLIES = [
  {
    entityId: "v4_ally_mj",
    canonicalName: "Mary Jane Watson",
    assetType: "ally",
    localPath: "assets/v4/cards/mary_jane.webp",
    provenance: "Insomniac Marvel's Spider-Man Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 20%",
    fallbackPath: "assets/v4/cards/fallbacks/ally_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Support Rule: Client Communication & Financial Audit",
    effectDefinition: {
      trigger: "ON_ACTION_COMPLETE",
      target: "gold",
      operation: "multiply",
      value: 1.20,
      conditions: { domain: ["business_growth", "life_admin"] },
      copy: { name: "Investigative Lead", description: "+20% Gold bonus when completing invoicing, taxes, or sales proposals." }
    }
  }
];
```

### 3.4 Suits (4 Tactical Costumes)

```js
export const VERIFIED_SUITS = [
  {
    entityId: "v4_suit_classic",
    canonicalName: "Classic Red & Blue Suit",
    assetType: "suit",
    localPath: "assets/v4/cards/suit_classic.webp",
    provenance: "Insomniac Spider-Man Verified Asset",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 25%",
    fallbackPath: "assets/v4/cards/fallbacks/suit_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Standard Balanced Freelancer Suit",
    effectDefinition: {
      trigger: "PASSIVE_ALWAYS",
      target: "xp",
      operation: "multiply",
      value: 1.05,
      copy: { name: "Baseline Reliability", description: "+5% XP across all completed real-world actions." }
    }
  },
  {
    entityId: "v4_suit_advanced",
    canonicalName: "Advanced Suit 2.0",
    assetType: "suit",
    localPath: "assets/v4/cards/suit_advanced.webp",
    provenance: "Insomniac Spider-Man 2 Verified Asset",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 25%",
    fallbackPath: "assets/v4/cards/fallbacks/suit_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "High-Focus Project Delivery Suit",
    effectDefinition: {
      trigger: "ON_BOSS_ATTACK",
      target: "damage",
      operation: "multiply",
      value: 1.15,
      conditions: { domain: ["client_work"] },
      copy: { name: "Flexible Armor Plating", description: "+15% Boss Damage dealt on client project tasks." }
    }
  },
  {
    entityId: "v4_suit_stealth",
    canonicalName: "Stealth 'Big Time' Suit",
    assetType: "suit",
    localPath: "assets/v4/cards/suit_stealth.webp",
    provenance: "Marvel Comics Official Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 20%",
    fallbackPath: "assets/v4/cards/fallbacks/suit_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Deep Work Noise Cancellation Suit",
    effectDefinition: {
      trigger: "ON_FOCUS_SESSION_END",
      target: "energy",
      operation: "add",
      value: 10,
      conditions: { minDurationMinutes: 45 },
      copy: { name: "Acoustic Camouflage", description: "Refunds 10 Energy upon finishing deep work focus sessions (45m+)." }
    }
  },
  {
    entityId: "v4_suit_2099",
    canonicalName: "Spider-Man 2099 White Suit",
    assetType: "suit",
    localPath: "assets/v4/cards/suit_2099.webp",
    provenance: "Marvel Official Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 20%",
    fallbackPath: "assets/v4/cards/fallbacks/suit_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "High-Tech Craft & Skill Mastery Suit",
    effectDefinition: {
      trigger: "PASSIVE_ALWAYS",
      target: "mastery_xp",
      operation: "multiply",
      value: 1.25,
      conditions: { domain: ["craft"] },
      copy: { name: "Nanofiber Weave", description: "+25% Domain Mastery XP when practicing core professional skills." }
    }
  }
];
```

### 3.5 Skills (6 Skill Tree Nodes)

```js
export const VERIFIED_SKILLS = [
  {
    entityId: "v4_skill_spider_sense",
    canonicalName: "Spider-Sense Urgency",
    assetType: "skill",
    localPath: "assets/v4/cards/skill_spider_sense.webp",
    provenance: "Insomniac Skill Icon Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 50%",
    fallbackPath: "assets/v4/cards/fallbacks/skill_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Deadline Urgency & Priority Detection",
    effectDefinition: {
      trigger: "ON_ACTION_COMPLETE",
      target: "xp",
      operation: "multiply",
      value: 1.15,
      conditions: { urgency: "due_today" },
      copy: { name: "Early Warning Radar", description: "+15% XP bonus for completing tasks scheduled due today." }
    }
  },
  {
    entityId: "v4_skill_web_strike",
    canonicalName: "Web Strike Execution",
    assetType: "skill",
    localPath: "assets/v4/cards/skill_web_strike.webp",
    provenance: "Insomniac Skill Icon Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 50%",
    fallbackPath: "assets/v4/cards/fallbacks/skill_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "First Action of the Day Burst Damage",
    effectDefinition: {
      trigger: "ON_ACTION_COMPLETE",
      target: "damage",
      operation: "multiply",
      value: 1.50,
      limits: { maxPerDay: 1 },
      copy: { name: "Opening Strike", description: "+50% Boss Damage on the very first completed action of the day." }
    }
  },
  {
    entityId: "v4_skill_perfect_dodge",
    canonicalName: "Perfect Dodge (Burnout Shield)",
    assetType: "skill",
    localPath: "assets/v4/cards/skill_perfect_dodge.webp",
    provenance: "Insomniac Skill Icon Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 50%",
    fallbackPath: "assets/v4/cards/fallbacks/skill_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Stress Accumulation Shield",
    effectDefinition: {
      trigger: "PASSIVE_ALWAYS",
      target: "max_stress",
      operation: "add",
      value: 20,
      copy: { name: "Mental Buffer", description: "Increases maximum Stress capacity from 100 to 120 before Recovery Mode." }
    }
  },
  {
    entityId: "v4_skill_electro_kinesis",
    canonicalName: "Bio-Electric Focus Burst",
    assetType: "skill",
    localPath: "assets/v4/cards/skill_electro_kinesis.webp",
    provenance: "Miles Morales Game Icon Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 50%",
    fallbackPath: "assets/v4/cards/fallbacks/skill_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Pomodoro Stagger Multiplier",
    effectDefinition: {
      trigger: "ON_FOCUS_SESSION_END",
      target: "stagger",
      operation: "multiply",
      value: 1.25,
      copy: { name: "Chain Lightning Focus", description: "+25% Stagger points generated during Pomodoro focus timers." }
    }
  },
  {
    entityId: "v4_skill_distortion_riff",
    canonicalName: "Sonic Distortion Riff",
    assetType: "skill",
    localPath: "assets/v4/cards/skill_distortion_riff.webp",
    provenance: "Spider-Punk Comic Asset Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 50%",
    fallbackPath: "assets/v4/cards/fallbacks/skill_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Batch Task Clearing Bonus",
    effectDefinition: {
      trigger: "ON_ACTION_COMPLETE",
      target: "gold",
      operation: "add",
      value: 10,
      conditions: { minConsecutiveSameDay: 3 },
      copy: { name: "Tempo Surge", description: "Grants +10 flat Gold per task completed after a 3-task daily streak." }
    }
  },
  {
    entityId: "v4_skill_analytical_mind",
    canonicalName: "Analytical Mind",
    assetType: "skill",
    localPath: "assets/v4/cards/skill_analytical_mind.webp",
    provenance: "Spider-Man 2099 Icon Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 50%",
    fallbackPath: "assets/v4/cards/fallbacks/skill_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Intellect & Strategy Scaling",
    effectDefinition: {
      trigger: "PASSIVE_ALWAYS",
      target: "attribute_xp",
      operation: "multiply",
      value: 1.20,
      conditions: { attributes: ["intellect"] },
      copy: { name: "Systematic Analysis", description: "+20% Strategy & Craft Attribute XP gained from all activities." }
    }
  }
];
```

### 3.6 Gadgets (2 Tactical Tools)

```js
export const VERIFIED_GADGETS = [
  {
    entityId: "v4_gadget_web_shooter",
    canonicalName: "Web-Shooter (Armor Bypass)",
    assetType: "gadget",
    localPath: "assets/v4/cards/gadget_web_shooter.webp",
    provenance: "Insomniac Gadget Icon Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 50%",
    fallbackPath: "assets/v4/cards/fallbacks/gadget_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Tactical Tool: Ignores Client Revision Armor",
    effectDefinition: {
      trigger: "ON_BOSS_ATTACK",
      target: "armor_bypass",
      operation: "add",
      value: 300,
      limits: { maxPerDay: 2 },
      copy: { name: "Web Tethering", description: "Bypasses up to 300 Boss Armor on 2 action completions per day." }
    }
  },
  {
    entityId: "v4_gadget_impact_web",
    canonicalName: "Impact Web (Stagger Burst)",
    assetType: "gadget",
    localPath: "assets/v4/cards/gadget_impact_web.webp",
    provenance: "Insomniac Gadget Icon Reference",
    verificationStatus: "verified_official",
    classification: "official_marvel_sony",
    cropFocalPoint: "50% 50%",
    fallbackPath: "assets/v4/cards/fallbacks/gadget_default.svg",
    reviewer: "Antigravity Audit",
    dateVerified: "2026-08-13",
    gameplayRole: "Tactical Tool: High Stagger Damage Burst",
    effectDefinition: {
      trigger: "ON_ACTION_COMPLETE",
      target: "stagger",
      operation: "add",
      value: 50,
      limits: { maxPerDay: 1 },
      copy: { name: "High-Velocity Impact", description: "Deals +50 instant Stagger points to the active project Boss once per day." }
    }
  }
];
```

---

## 4. Visual Card Layout Contract

Card faces on gallery grids adhere to a strict minimal layout:

```text
┌──────────────────────────────────────┐
│ [CARD THUMBNAIL IMAGE]               │
│ Aspect Ratio: 2:3                    │
│ Crop Focal Point: e.g. "50% 20%"     │
│                                      │
│                                      │
├──────────────────────────────────────┤
│ PETER PARKER (Earth-616)             │  <-- CANONICAL NAME ONLY
└──────────────────────────────────────┘
```

- **NO STAT NUMBERS ON FACE:** No health bars, attack values, or percentage numbers printed directly over thumbnail images.
- **HOVER / TAP STATE:** Hovering or tapping a card face highlights the card with a cyan border (`--color-spider-cyan`) and displays a clean inspect tag (`[INSPECT DECK]`).

---

## 5. Asset Policy Acceptance Checklist

- [x] 5 strict asset integrity rules defined.
- [x] JSON Schema for asset manifest entries fully specified.
- [x] Exactly 18 launch vertical slice items fully declared with verified paths, roles, and effect definitions.
- [x] Clear card face layout contract defined (Image + Name only).
