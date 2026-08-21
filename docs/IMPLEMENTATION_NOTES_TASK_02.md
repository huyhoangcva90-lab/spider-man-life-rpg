# Implementation Notes - Task 02: Action Taxonomy and Functional Build Modifiers

## Overview
This task introduced a distinct mechanical taxonomy for actions (Habit, Task, Milestone, Quest, Goal) and migrated the descriptive UI-based equipment build system into a robust data-driven modifier system evaluated at runtime by the `GameEngine`.

## Changes Made
### 1. Normalized Action Schema & Taxonomy
- Redefined `GameEngine.executeAction(actionPayload)` to process unified action kinds: `habit`, `task`, `milestone`, `quest`, `goal`.
- **Habit**: Base damage (15), high stagger (20), lower XP (10) and Gold (5). Repeatable per daily window.
- **Task**: Difficulty-derived scaling. Normal (30 dmg, 10 stagger, 25 XP), Hard (60 dmg, 20 stagger, 50 XP).
- **Milestone**: Critical strike (200 dmg, 50 stagger, 100 XP).
- **Quest**: Quest completion bonus (100 dmg, 30 stagger, 80 XP).
- **Goal**: Read-only outcome container tracking projects. Cannot be completed for combat rewards.

### 2. Functional Build Modifiers
- Deprecated hardcoded ID parsing in `BuildSystem.deriveBuild`. Modifiers are now defined dynamically on seed definitions (`suits.js`, `gadgets.js`, `companions.js`, `skills.js`).
- Created a formal `Modifier` schema: `{ target: 'xp'|'gold'|'attributeXp'|'damage'|'stagger', operation: 'multiply'|'add', value, when: { actionKinds, difficulty, attributes, tags, villainIds } }`.
- Added `BuildSystem.evaluateModifiers(modifiers, target, context)` to compute scalar multipliers and addends per action type based on the context (e.g., matching the `habit` action kind, or matching the `intellect` attribute).
- Modifiers from equipped items, active skills, and companions are evaluated synchronously before generating final combat stats and rewards.

### 3. Equipment Functional State
- Enhanced `GameEngine` with `equipGadget(gadgetId)` and `unequipGadget(gadgetId)`.
- Enforced a maximum of 2 active gadgets. Attempting to equip a 3rd will alert the user to unequip one first.
- Updated `renderGadgetsView` in `app.js` to render equip/unequip controls seamlessly.

### 4. UI Taxonomy Enhancements
- Updated Daily view: Actions are now clearly labeled as `HABIT • CONTROL`.
- Updated Quests view: Actions are labeled as `TASK • ATTACK`.
- Updated Projects view: Milestones denote `MILESTONE • CRITICAL`.
- Added a new **Active Goals Summary** container in the Projects view to visibly bridge the outcome strategy metric with tactical projects.
- Revamped the Character Build Summary card to loop through `activeModifiers` and print each effect dynamically using the parsed target, operation, value, and activation condition in user-friendly language.

### 5. Data Migration & Persistence
- Added `goals` array to `QUESTS_DATA` seed in `data/quests.js`.
- Updated `StorageManager.validateAndMergeDefaults()` to safely inject the `goals` array into active V2 snapshots without overriding user progress and without bumping the `schemaVersion`.
- Preserved V1 to V2 migration compatibility.

## Design Principles Kept
- **Declarative Extensibility**: Adding new suits or abilities now only requires touching static seed files with standard JSON modifiers instead of patching the core engine.
- **Pure Game Engine**: `GameEngine` processes actions as distinct transactional kinds mapping to domain rules, maintaining independence from UI presentation.
- **Idempotent Rewards**: The logic introduced in TASK 01 to prevent duplication on reloads remains perfectly intact across all the newly defined action taxonomies.

## QA Fixes
- **Syntax Error Fix 01**: Fixed a syntax issue in `js/app.js` where backticks enclosing string templates and variables (`${...}`) within innerHTML updates and HeroVoiceSynthesizer text evaluations were incorrectly escaped using a backslash `\`. Replaced the escaped backticks with actual JavaScript template literals and ensured that interpolation expressions evaluated correctly without backslashes.
