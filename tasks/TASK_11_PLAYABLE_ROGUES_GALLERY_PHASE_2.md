# TASK

Playable Rogues Gallery Phase 2 — Green Goblin, Venom, Scorpion, Encounter Selection and Combat Clarity

# OBJECTIVE

Continue the current Spider Life RPG prototype by turning three additional villains into mechanically distinct, fully playable encounters using reusable encounter descriptors. Improve the Villains-to-Boss flow so a user can understand a villain, assign/select the encounter safely, and then progress it only through legitimate real-life actions.

# CONTEXT

TASK 01–10 are complete. Preserve the current V2 localStorage architecture, action ledger, idempotent loot, build/mastery systems, 14 screens, 134 working images, Spider Ops Tracker map, synthesized sound settings, and responsive UI.

Doctor Octopus, Mysterio, and Lizard already have executable mechanics. Green Goblin, Venom, Scorpion and most gallery entries currently have phases and presentation data but not equally distinctive encounter behavior. This milestone should add depth, not bulk content.

Read `docs/PRODUCT_ARCHITECTURE.md`, all existing implementation notes, `data/villains.js`, `js/boss-system.js`, `js/game-engine.js`, `js/storage.js`, `js/app.js`, and the relevant HTML/CSS before editing. The active controller is `js/app.js`; root `app.js` is legacy and MUST NOT be edited.

This is a headless Antigravity run. Use file read/search/edit and browser tools only. Do not invoke terminal, shell, command, package-manager, or run-command tools; command approval cannot be granted inside the headless session. Perform browser-based verification with the available browser tools and clearly document any check that cannot be run without a terminal.

# FILES

Modify only as needed:

- `data/villains.js`
- `js/boss-system.js`
- `js/game-engine.js`
- `js/storage.js`
- `js/app.js`
- `index.html`
- `styles.css`
- `docs/IMPLEMENTATION_NOTES_TASK_11.md`

# REQUIREMENTS

1. Implement three additional mechanically distinct playable villains using generic declarative descriptors interpreted by `BossSystem`:
   - **Green Goblin — chaos rotation**: the active favored action category/attribute changes on a deterministic cadence or phase transition. Matching it grants a clear combat benefit; mismatching it must not erase legitimate progression rewards.
   - **Venom — momentum/dependency pressure**: high momentum or Willpower-tagged actions improve damage/stagger; low energy may add a bounded encounter-only drawback. Never remove earned XP/Gold/attribute/mastery rewards.
   - **Scorpion — consistency/streak pressure**: habit streak/consistent actions improve stagger or suppress armor recovery; ordinary tasks remain useful and never become fake/zero-value work.
2. Mechanics must be data-driven. No `if (villainId === ...)` branches in UI or GameEngine. A generic resolver may switch on descriptor `type`.
3. Normalize mechanic output into structured combat events where practical: `{ type, tone, message, deltas }`. Existing string fields may be migrated safely, but the Boss Arena must always render readable fallback text.
4. Preserve deterministic and bounded behavior. No timers that mutate encounter state in the background, no random punishment on page load, and no reward mutation from merely viewing/selecting a villain.
5. Improve Villains screen encounter affordance:
   - distinguish current boss, playable mechanic support, compendium-only/safe-default entries, and difficulty;
   - show phase/mechanic/weakness summary in the detail panel;
   - provide a clear action to assign/start an encounter for an eligible active project, with confirmation if it replaces an undefeated encounter;
   - if project binding already exists, reuse the authoritative project/encounter creation path instead of directly mutating boss state in UI.
6. The Boss Arena must clearly show:
   - active phase;
   - active mechanic and current mechanic state;
   - why the last action was boosted/reduced/recovered;
   - weakness and a short “recommended real-life action” hint;
   - no claim or combat button that can mint durable rewards without a real-life action.
7. Add or refine sound feedback using the existing synthesized `SoundFx` API only. Reuse named cues for phase, danger, confirmation and failure; do not add external audio or autoplay.
8. Preserve save compatibility. Merge safe defaults for new mechanic state fields into fresh and existing V2 saves. Do not reset user progress.
9. Repair mojibake only in files/strings touched by this task. Use UTF-8 and ensure new Vietnamese/English copy renders correctly.
10. Do not expand the gallery count in this task. Depth and correctness take priority.

# DATA MODEL

Prefer a generic definition shape similar to:

```js
mechanics: [
  {
    id: "stable-id",
    type: "chaosRotation | momentumPressure | consistencyPressure",
    trigger: "beforeAction | afterAction | phaseEnter",
    params: {},
    copy: { title, description, recommendedAction }
  }
]
```

If backward compatibility requires accepting the existing object-shaped mechanics, add a normalization layer instead of rewriting every villain at once.

Mutable encounter state belongs in `currentBossState.mechanicState` and must contain only serializable values. Static copy/configuration stays in villain definitions.

# UI

- Keep the current dark Spider-tech/card-art hierarchy.
- Make playable/current/status badges readable without relying on color alone.
- Confirmation dialogs must name both the current and replacement villain and explain what encounter progress will be replaced.
- Keep all primary actions keyboard reachable with visible focus.
- At 360px, no horizontal page overflow and no clipped primary button.
- Respect `prefers-reduced-motion`.

# GAME LOGIC

- Real-life actions remain the sole source of XP, Gold, attribute XP, mastery XP, boss damage, stagger and durable loot.
- Encounter selection/assignment initializes state through one authoritative engine/system method.
- A legitimate action transaction remains atomic and idempotent.
- Defeat and loot grant remain once-per-encounter.
- Mechanics may modify encounter damage/stagger/armor/HP only within documented bounds; they must never directly mint progression currencies.
- Existing Doc Ock, Mysterio and Lizard behavior must continue to work.

# ACCEPTANCE CRITERIA

- Green Goblin, Venom and Scorpion each produce visibly different, explainable results for the same valid action context.
- No villain-specific UI/GameEngine branches are introduced.
- User can inspect and intentionally bind a supported villain to an eligible project; replacement requires explicit confirmation.
- Selecting, filtering, opening details or assigning a villain does not grant XP/Gold/loot or damage a boss.
- Boss Arena explains phase, mechanic state, last resolution and a recommended action.
- Doc Ock, Mysterio and Lizard regressions pass.
- Fresh and existing V2 state load without data loss.
- All 14 screens navigate correctly; 134/134 media still load; no console errors.
- JavaScript parses and layout has no horizontal overflow at desktop and 360px.

# TEST

1. Fresh-state load and existing V2 merge.
2. Start/bind each of the six supported villains and verify authoritative encounter initialization.
3. For Green Goblin, compare matching vs non-matching chaos rotation actions.
4. For Venom, compare high-momentum/Willpower context vs low-energy ordinary context.
5. For Scorpion, compare streak habit context vs ordinary task context.
6. Verify Doc Ock armor bypass, Mysterio decoy, and Lizard regeneration still work.
7. Verify selecting/assigning/viewing a villain leaves XP, Gold, inventory, ledger and boss HP unchanged until a real action is completed.
8. Verify phase transition, stagger, finisher, defeat and once-only loot on at least one new villain.
9. Reload and verify encounter/mechanic state persistence.
10. Navigate all 14 screens at desktop and 360px; verify media counts and console.
11. Parse all loaded JavaScript.

# DO NOT

- Do not edit root `app.js`.
- Do not add backend, authentication, framework, bundler, package manager or build step.
- Do not scrape/download/copy proprietary assets or audio.
- Do not add fake combat clicks, passive timers or UI interactions that create durable progression.
- Do not reset or replace existing user saves.
- Do not rewrite the whole engine; extend it incrementally.
- Do not claim tests passed unless they were actually executed with available tools.
- Do not invoke shell/terminal/command tools in this headless run.

# DELIVERABLE

Implement the complete scope and write `docs/IMPLEMENTATION_NOTES_TASK_11.md` containing changed files, mechanic schemas, compatibility decisions, exact tests performed, test results and known limitations.
