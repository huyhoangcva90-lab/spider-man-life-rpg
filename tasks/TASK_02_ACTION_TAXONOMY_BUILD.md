# TASK

Action Taxonomy and Functional Build Modifiers

# OBJECTIVE

Make Habit, Task, Quest, Goal and Project mechanically distinct, and turn the current Suit/Gadget/Companion/Skill build from descriptive UI into data-driven modifiers applied by GameEngine.

# CONTEXT

TASK 01 is complete and verified. Read `docs/PRODUCT_ARCHITECTURE.md` and `docs/IMPLEMENTATION_NOTES_TASK_01.md`. Preserve V2 saves and the verified vertical slice. Implement roadmap milestones 2–3 only; no new boss/villain mechanics yet.

# FILES

- `data/quests.js`, `data/skills.js`, `data/suits.js`, `data/gadgets.js`, `data/companions.js`
- `js/game-engine.js`, `js/build-system.js`, `js/storage.js`, `js/app.js`
- `index.html`, `styles.css` only as required
- `docs/IMPLEMENTATION_NOTES_TASK_02.md`

# REQUIREMENTS

1. Define a normalized action schema with `kind`, `difficulty`, `repeatPolicy`, `tags`, reward packet and project/quest links.
2. Habit: repeatable per daily window, grants momentum + mastery + high stagger, lower damage.
3. Task: one-off atomic action with difficulty-derived normal/heavy attack.
4. Quest: task chain; quest completion bonus occurs once when all linked tasks complete.
5. Goal: outcome container with success metric and linked project IDs; grants no direct combat reward.
6. Project: owns milestones and an encounter link; milestone completion produces a critical attack and updates progress.
7. Keep existing seed content, migrating/normalizing it rather than creating lots of new content.
8. Replace ID-specific modifier parsing in BuildSystem with explicit `modifiers` objects on definitions.
9. Apply XP, Gold, Attribute XP, damage and stagger modifiers in the engine, including conditional tag/attribute matches.
10. Make equipped gadget state functional and add an equip/unequip control if missing; enforce max two gadgets.
11. Character Build summary must list derived modifiers in user language.
12. Daily/Quest/Project views must label the action kind/attack result clearly without becoming a database dashboard.
13. Add a compact active Goal summary on Projects view.
14. Migrate existing V2 snapshots by merging normalized fields/defaults without losing progress; do not bump schema version unless needed.

# DATA MODEL

```js
Action = { id, kind, difficulty, repeatPolicy, title, attribute, masteryTrackId, tags, rewards, links, completed, completionLog }
Modifier = { target: 'xp'|'gold'|'attributeXp'|'damage'|'stagger', operation: 'multiply'|'add', value, when: { actionKinds?, attributes?, tags?, villainIds? } }
Goal = { id, title, metricLabel, targetValue, currentValue, projectIds, status }
```

# UI

Preserve current command-center design. Use compact combat-language badges such as HABIT • CONTROL, TASK • ATTACK, HARD TASK • HEAVY, MILESTONE • CRITICAL. Build summary shows only active effects, not raw JSON.

# GAME LOGIC

All completions still use `GameEngine.executeAction`. Calculate a normalized reward packet, apply Build modifiers once, then progression and encounter. Quest/project bonuses need unique ledger IDs. Repeating a Habit is allowed only in a new daily window; Tasks and milestones remain one-time.

# ACCEPTANCE CRITERIA

- One Habit, one normal Task, one hard Task and one milestone produce visibly different attack/reward profiles.
- Goal itself cannot be completed for rewards or damage.
- Quest bonus and milestone reward are idempotent.
- Equipping a suit/gadget/companion with modifiers changes the correct engine output, persists after reload, and unequipping removes it.
- Existing TASK 01 action/loot/idempotency tests remain valid.
- All views load with no console errors at desktop and 360px without horizontal overflow.

# TEST

Fresh state and migrated V2 state; complete representative actions; compare engine results before/after equipment; attempt duplicate rewards; equip 0/1/2/3 gadgets; reload; navigate all views; test desktop and 360px.

# DO NOT

- Do not add backend/auth/build tools.
- Do not implement villain-specific mechanics in this task.
- Do not hard-code modifier behavior by item ID.
- Do not edit legacy root `app.js`.
- Do not redesign the visual shell or manufacture large content lists.
