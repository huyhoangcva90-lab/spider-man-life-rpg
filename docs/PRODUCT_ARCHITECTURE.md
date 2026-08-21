# Spider Life RPG — Product & Technical Architecture

Status: implementation baseline for the HTML/CSS/Vanilla JavaScript prototype.

## 0. Audit baseline

The active runtime is `index.html` → `data/*.js` → `js/storage.js` → system modules → `js/game-engine.js` → `js/app.js`. The root `app.js` is legacy and is not loaded by `index.html`.

What already works:

- Game-styled shell with 12 views and a strong superhero command-center identity.
- Daily action → XP/Gold/Attribute XP → boss damage/stagger → localStorage persistence.
- Character, projects, skill tree, suits, gadgets, allies, villains, shop, export/import.
- Boss HP, armor, stagger, phase display and finisher interaction.

Critical gaps:

- No schema version, migration, validation, action ledger, or safe import boundary.
- Seed arrays are reused by reference; reset may preserve mutations made during the session.
- Level, Attribute, Skill, Equipment exist, but Build and Mastery are not real systems.
- Skill, suit, gadget, and companion effects are mostly descriptive rather than engine modifiers.
- Boss phases are hard-coded; villain mechanics and weaknesses are not resolved generically.
- Boss victory grants generic rewards and can be vulnerable to duplicate claims; loot is not inventory state.
- Project completion, boss defeat, loot unlock, and next encounter are not one transactional flow.
- Energy and momentum are UI counters rather than meaningful resources.
- Desktop layout has horizontal clipping around the directive banner and dense top status bar.

## 1. Product architecture

The product is a local-first Life RPG. Real-life actions are the only source of durable progression. The app must never sell progress for fake clicks or become a CRUD dashboard with game decoration.

### Domain boundaries

1. **Action domain** — habits, tasks, quests, milestones, goals, projects.
2. **Progression domain** — account level, attribute levels, skills, mastery tracks.
3. **Build domain** — equipped suit, gadgets, companion, unlocked abilities, derived modifiers.
4. **Encounter domain** — project-linked boss, HP, armor, stagger, phases, mechanics, weaknesses.
5. **Economy domain** — gold, loot drops, inventory, collection, reward shop.
6. **Persistence domain** — versioned snapshot, migrations, import/export, action ledger.
7. **Presentation domain** — views, renderers, modals, animation, audio, accessibility.

The engine accepts commands and emits events. UI code never calculates rewards or mutates domain state directly.

```text
UI intent
  → Command (completeAction / unlockSkill / equipItem / claimLoot)
  → GameEngine transaction
  → Domain systems
  → Events + next state
  → Repository.save(snapshot)
  → UI render(events, state)
```

## 2. Game-system architecture

### System modules

- `ActionSystem`: validates completion, enforces repeat rules, creates an immutable action record.
- `RewardSystem`: converts action type/difficulty/category into a reward packet.
- `ProgressionSystem`: applies account XP, attribute XP, skill points, and mastery XP.
- `BuildSystem`: derives active modifiers from skills/equipment/companion.
- `EncounterSystem`: resolves attack type, weakness, armor, stagger, phase transitions and mechanics.
- `LootSystem`: rolls/awards deterministic loot once per encounter and updates inventory.
- `ProjectSystem`: maps project milestones to encounter attacks and tracks project completion.
- `EconomySystem`: gold earning/spending and reward purchase history.
- `PersistenceRepository`: load, migrate, validate, clone, save, import and export.

All systems are pure where practical: `(state, command) → { nextState, events }`. Browser APIs belong only in adapters.

### Transaction rule

A completion is atomic. XP, gold, attribute XP, mastery XP, attack, phase transition, defeat, and loot eligibility either all commit or none commit. `actionId` and `encounterId` provide idempotency.

## 3. Data model

Top-level snapshot:

```js
{
  schemaVersion: 2,
  profile: { id, heroName, createdAt, themeId },
  progression: {
    level, xp, xpToNext, skillPoints,
    attributes: { agility, power, intellect, focus, discipline, willpower },
    attributeXp: { agility, power, intellect, focus, discipline, willpower },
    masteries: { fitness, deepWork, learning, discipline }
  },
  resources: { gold, energy, maxEnergy, momentum, maxMomentum },
  build: {
    equippedSuitId,
    equippedGadgetIds,
    companionId,
    unlockedSkillIds,
    activeAbilityIds
  },
  content: {
    habits: [], tasks: [], quests: [], goals: [], projects: []
  },
  encounter: {
    encounterId, projectId, villainId, status,
    currentHp, currentArmor, stagger, currentPhaseId,
    mechanicState: {}, rewardClaimed: false, combatLog: []
  },
  inventory: {
    itemStacks: {}, unlockedItemIds: [], newItemIds: [], defeatRecords: []
  },
  economy: { purchases: [], customRewards: [] },
  ledger: { completedActionIds: [], transactions: [] },
  meta: { lastSavedAt, lastDailyResetAt }
}
```

Content definitions stay outside the save snapshot and are referenced by stable IDs:

```js
VillainDefinition = {
  id, name, archetype, baseStats,
  phases: [{ id, enterAtHpRatio, armorMultiplier, damageTakenMultiplier, mechanics }],
  weaknesses: [{ kind, target, multiplier, staggerMultiplier }],
  mechanics: [{ id, trigger, effect, copy }],
  lootTable: [{ itemId, chance, quantity, guaranteed }]
}
```

Only mutable player/content state is persisted. Static definitions are merged at render/resolve time. This makes a later backend or Notion adapter replace the repository without rewriting the engine.

## 4. Progression design

### Level

Represents breadth and total life progress. It unlocks content tiers and grants two skill points per level. It does not directly increase every stat.

`xpToNext(level) = round(100 × level^1.35)`

### Attributes

Represent capability dimensions earned only from matching real-life action categories. Attribute XP is separate from account XP.

`attributeXpToNext(value) = round(50 × value^1.15)`

### Skills

Discrete player choices bought with skill points. Skills unlock rules or modifiers; they do not duplicate attributes.

### Build

The currently equipped combination of suit + up to two gadgets + one companion + unlocked active abilities. Build determines play style and derived modifiers for rewards/combat.

### Equipment

Collectible items obtained through loot or explicit unlock rules. Equipment has passive modifiers and optional active abilities. It never awards base progression by itself.

### Mastery

Long-term specialization earned through repeated actions in a track. Mastery XP never increases account level and cannot be purchased with skill points.

Suggested thresholds: `masteryXpToNext(rank) = 100 × (rank + 1)^1.5`, ranks 0–10.

### Economy mapping

- Account XP → Level.
- Attribute XP → Attribute levels.
- Skill points → Skill tree decisions.
- Mastery XP → Mastery ranks/perks.
- Gold → real-life reward shop and controlled utility purchases.
- Loot → equipment, cosmetics, blueprints and collection.

## 5. Core gameplay loop and taxonomy

- **Habit**: repeatable behavior; builds streak, momentum and mastery. Lower burst damage, high stagger consistency.
- **Task**: atomic one-off work; primary XP/gold and normal attack source.
- **Quest**: curated chain of related tasks; grants completion bonus and unlocks content.
- **Project**: multi-milestone real-world outcome; owns one boss encounter.
- **Goal**: desired outcome and success metric; groups projects but does not directly deal damage.
- **Level**: global progression gate and skill-point source.
- **Gold**: controlled real-life reward currency.
- **Stats**: capability profile and weakness matching.
- **Skills**: chosen rules and modifiers.
- **Mastery**: depth earned by sustained practice in a domain.

Attack mapping:

- Habit check-in → Combo/Control attack; 10–20 damage, 15–25 stagger.
- Normal task → Attack; 20–35 damage, 8–15 stagger.
- Hard task → Heavy attack; 45–70 damage, 15–25 stagger.
- Quest completion → Ability attack; 80–140 damage.
- Milestone → Critical hit; 150–300 damage.
- Stagger break → Finisher window.
- Final project milestone → Finisher eligibility, not automatic victory.

## 6. Boss and villain design

An encounter is generated from a Project + VillainDefinition. The project gives meaning to victory; the villain changes the rules.

### Generic combat order

1. Validate action and compute attack archetype.
2. Apply build modifiers.
3. Match attribute/action tags against weaknesses.
4. Resolve armor and phase multipliers.
5. Apply HP and stagger.
6. Trigger mechanics and phase transitions.
7. Open a finisher window at full stagger.
8. On defeat, lock encounter, create loot grant once, update project and collection.

### Villain identities

- Doctor Octopus: complex projects; multiple active milestone lanes, armor rises when lanes are neglected.
- Mysterio: distraction; decoy tasks grant reduced rewards until the user marks a priority quest.
- Scorpion: inconsistency; missed habit windows restore armor, streak actions amplify stagger.
- Lizard: physical neglect; regeneration is suppressed by physical/health actions.
- Venom: dependency/bad habits; momentum boosts damage but low energy increases backlash.
- Green Goblin: chaos; phase modifiers rotate, rewarding adaptable task categories.

Mechanics are declarative effect descriptors interpreted by the EncounterSystem, never villain-specific `if` blocks in UI code.

## 7. Reward and loot design

Reward packet:

```js
{
  accountXp, gold,
  attributeXp: { attribute, amount },
  masteryXp: { trackId, amount },
  attack: { type, baseDamage, stagger, tags },
  resourceDelta: { energy, momentum }
}
```

Boss defeat produces a `lootGrantId = encounterId + ':victory'`. If that ID exists in the ledger, rewards cannot be granted again. Guaranteed drops are awarded first; chance drops use a persisted roll seed. Claiming loot changes presentation state only—the durable grant happens in the victory transaction.

## 8. Persistence architecture

- Storage key: `LIFE_RPG_STATE_V2`.
- Snapshot always includes `schemaVersion`.
- `load()` parses, migrates sequentially, validates required shape, merges safe defaults and deep-clones.
- V1 migration preserves current prototype progress.
- Every mutation saves through one repository method.
- Import validates size, JSON type, schema version, IDs and numeric ranges before replacing state.
- Export includes `exportedAt`, app version and checksum-ready metadata.
- Backend/Notion migration later implements the same repository interface: `load`, `save`, `appendTransaction`, `export`, `import`.

## 9. UI architecture

The visual thesis is a **Spider command center under attack**. The signature element is the live boss encounter paired directly with today's directive. Keep it; remove decorative features only when they obscure the core loop.

Render layers:

- `AppShell`: navigation, header resources, responsive drawer.
- `HomeView`: next best action + active boss + today progress.
- `CharacterView`: level, attributes, mastery, active build.
- `ActionViews`: Daily, Quests, Projects.
- `BuildViews`: Skills, Suits, Gadgets, Allies.
- `EncounterViews`: Boss Arena, Villains.
- `EconomyViews`: Shop, Collection.
- `OverlayLayer`: forms, loot, level-up, confirmations, combat feedback.

UI renderers consume selectors/state/events but never contain formulas. Required quality floor: 360px mobile, 768px tablet, desktop; visible focus; semantic labels; reduced-motion handling; no clipped primary actions.

Design tokens remain Spider-specific in `styles.css`, while content IDs and engine terminology stay generic. Theme replacement should require data/assets/tokens, not game-engine changes.

## 10. Folder structure target

```text
index.html
styles.css
data/
  villains.js skills.js suits.js gadgets.js companions.js quests.js items.js
js/
  config.js
  domain/
    action-system.js progression-system.js build-system.js
    encounter-system.js loot-system.js project-system.js economy-system.js
  infrastructure/
    storage-repository.js migrations.js validators.js
  ui/
    app.js renderers.js events.js feedback.js
  game-engine.js
docs/
tasks/
tools/
```

During the prototype, gradual extraction is preferred over a risky rewrite.

## 11. Milestone roadmap

1. **Foundation & vertical-slice correctness** — versioned state, migrations, action ledger, idempotent defeat/loot, Mastery/Build state.
2. **Action taxonomy** — Habit/Task/Quest/Goal/Project rules and creation flows.
3. **Progression & build modifiers** — Skills, mastery perks, equipment effects and derived build summary.
4. **Generic boss engine** — phase definitions, weaknesses, mechanics, finisher window and project binding.
5. **Loot, collection & economy** — inventory, deterministic grants, collection view, purchase history.
6. **Villain differentiation** — one complete Doctor Octopus encounter plus two mechanically distinct villains.
7. **UI/UX hardening** — responsive navigation, unclipped home directive, accessibility and reduced motion.
8. **Balancing & release QA** — fresh-start vertical slice, migration test, persistence, export/import and offline behavior.

Definition of done: a fresh user can complete a daily action, gain separate progression currencies, advance a project encounter through stagger and phases, defeat the boss once, claim durable loot, equip it, reload, and retain the resulting character progression without console errors.
