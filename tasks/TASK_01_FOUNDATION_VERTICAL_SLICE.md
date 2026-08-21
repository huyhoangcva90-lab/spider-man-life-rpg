# TASK

Foundation and Vertical-Slice Correctness

# OBJECTIVE

Stabilize the existing modular prototype so the real-life action → progression → boss → defeat → loot → persistent character progression loop is correct, versioned, idempotent and extensible. Preserve the current visual identity and all working screens.

# CONTEXT

The active entrypoint is `index.html` and the active implementation is under `data/` and `js/`. Root `app.js` is legacy and is not loaded. The current UI already has strong game feel, but persistence is unversioned, static seed data is reused by reference, Mastery/Build are missing as durable systems, boss rewards are generic, and encounter victory/loot can become inconsistent.

Read `docs/PRODUCT_ARCHITECTURE.md` before editing. Implement Milestone 01 only. Do not expand content volume.

# FILES

Create or modify only as needed:

- `js/storage.js`
- `js/game-engine.js`
- `js/boss-system.js`
- `js/xp-system.js`
- `js/stat-system.js`
- `js/mastery-system.js` (new)
- `js/loot-system.js` (new)
- `js/build-system.js` (new)
- `data/items.js` (new, minimal vertical-slice items only)
- `js/app.js`
- `index.html`
- `styles.css` only for minimal UI needed by this task
- `docs/IMPLEMENTATION_NOTES_TASK_01.md` (new)

Do not edit or delete root `app.js`.

# REQUIREMENTS

1. Add `schemaVersion: 2` and a new storage key `LIFE_RPG_STATE_V2`.
2. Migrate existing `SPIDER_LIFE_RPG_PROTOTYPE_DATA_V1` data without losing current progress.
3. Deep-clone all seed definitions when building/resetting mutable state.
4. Add durable `progression.masteries`, `build`, `inventory`, and `ledger` state. Maintain compatibility helpers or update renderers cleanly; no broken views.
5. All action rewards must pass through `GameEngine.executeAction()` as one transaction.
6. Reject duplicate `actionPayload.id` values using `ledger.completedActionIds`.
7. Boss defeat must be idempotent. Award victory XP/gold/loot once per `encounterId`.
8. Add a minimal inventory containing one guaranteed Doctor Octopus drop from the existing loot concept.
9. Claiming the loot modal must not award rewards again. It only acknowledges the already-persisted grant and prepares/restarts the demo encounter intentionally.
10. Add Mastery XP to action payloads and one visible Mastery summary in Character view.
11. Add a Build state containing equipped suit, gadget IDs and companion ID. Existing equip interactions must update it.
12. Add a visible Collection view or a compact Collection panel reachable from the current navigation. It only needs to show unlocked inventory for this vertical slice.
13. Existing daily completion, skill unlock, equipment, shop, project, export/import and reset flows must still run.
14. Add safe import validation: reject non-object payloads, unsupported future schema versions, missing essential objects and clearly invalid numeric values.
15. Fix the desktop clipping of the Spider-Sense directive action and ensure the home view remains usable at 360px width.

# DATA MODEL

Use the target shape in `docs/PRODUCT_ARCHITECTURE.md`. A compatibility-oriented incremental migration is acceptable, but the following fields are mandatory:

```js
{
  schemaVersion: 2,
  progression: { masteries: {} },
  build: { equippedSuitId, equippedGadgetIds: [], companionId, unlockedSkillIds: [] },
  inventory: { unlockedItemIds: [], itemStacks: {}, newItemIds: [], defeatRecords: [] },
  ledger: { completedActionIds: [], transactions: [], grantedRewardIds: [] },
  currentBossState: { encounterId, status, rewardClaimed }
}
```

Preserve current `character` and `questsState` fields during this milestone if replacing them would destabilize the UI.

# UI

- Preserve the Spider command-center identity, typography, colors and core layout.
- Character view: add a concise Mastery section and current Build summary.
- Collection: show the guaranteed boss drop, locked/empty state, and “new” status.
- Loot modal: render actual awarded item(s) from inventory/loot result.
- Home directive and its CTA must never clip horizontally on desktop or mobile.
- New controls require visible keyboard focus and meaningful labels.

# GAME LOGIC

Action transaction order:

1. Validate action and action ID.
2. Reject a duplicate before any mutation.
3. Apply account XP, attribute XP, mastery XP and gold.
4. Resolve boss attack and phase/stagger state.
5. If defeated, lock encounter and create `rewardGrantId = encounterId + ':victory'`.
6. If grant ID is new, award victory XP, gold and guaranteed loot; record transaction and defeat.
7. Persist once after the complete transaction.
8. Return structured events to the UI.

No UI function may separately grant boss victory rewards.

# ACCEPTANCE CRITERIA

- Fresh load has no console errors and all 12 existing views remain navigable.
- Completing one unfinished daily updates XP, Gold, matching Attribute XP, Mastery XP, Boss HP/Armor/Stagger and persists after reload.
- Calling the same action ID twice changes state only once.
- Boss defeat awards victory XP/gold/item exactly once even if victory checks or modal interactions repeat.
- The actual loot item appears in Collection and persists after reload.
- Reset creates a genuinely fresh deep clone; an unlocked skill/item does not leak into reset state.
- Existing V1 data migrates once and preserves level, XP, gold, completed quests and boss progress.
- Invalid imports are rejected without replacing the current state.
- At 360px and desktop widths, the primary home CTA is visible and usable.
- No destructive edits to unrelated/legacy files.

# TEST

1. Load with no V2 key: verify V1 migration or clean V2 creation.
2. Complete one daily action; record all reward deltas and reload.
3. Attempt the same action ID again through the engine; verify no delta.
4. Drive boss to zero HP; verify one victory transaction and one item.
5. Re-run victory check and click claim more than once; verify no extra rewards.
6. Equip a suit/companion/gadget and reload; verify Build state.
7. Unlock a skill, reset, and verify seed data is pristine.
8. Import malformed JSON, wrong shape, and future schema version; verify current state survives.
9. Navigate all views and check console for errors.
10. Test 360×800 and desktop viewport for overflow/clipping.

# DO NOT

- Do not rewrite the app in React or add a build tool/backend/database/authentication.
- Do not delete root `app.js`.
- Do not replace the visual design with a generic dashboard.
- Do not create dozens of placeholder items, villains or skills.
- Do not hard-code loot presentation independently from inventory state.
- Do not use `dangerously-skip-permissions` or weaken sandbox/security settings.
- Do not change product formulas or terminology outside this task without documenting the assumption first.
