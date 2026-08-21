# TASK

Clean Rebuild Blueprint and Spider-Verse Art Direction

# OBJECTIVE

Plan a clean rebuild of the current Life RPG rather than continuing to patch its accumulated UI and content problems. Produce a decisive product blueprint, visual system, information architecture, asset policy, migration strategy, and small implementation roadmap for Antigravity.

Do not implement application code in this task.

# USER FEEDBACK

The current app feels low quality because:

- visual hierarchy is noisy and inconsistent;
- images often represent the wrong character or reuse generic Spider-Man artwork;
- too many galleries and counters exist without a coherent core loop;
- the interface feels like unrelated modules assembled together;
- cards, Suits, Skills, Gadgets and Allies do not consistently affect gameplay;
- the user wants the Spider-Man / Spider-Verse fantasy retained, but rebuilt professionally from the beginning.

# TARGET USER

- Male, 29, independent freelancer.
- Needs client delivery, deep work, business development, money/admin, skill growth, health, recovery and relationships.
- Wants a mature action-RPG command center, not a childish habit tracker.
- Uses the product locally in a browser with no backend for now.

# FOUR PRODUCT REFERENCES

Analyze these four current products through official documentation and the supplied findings:

1. **Habitica**
   - Strong: clear Habits / Dailies / To-dos, immediate XP/Gold, equipment and quest loop.
   - Avoid: punitive missed-daily damage and cluttered legacy complexity.
   - Sources: `https://habitica.com/static/features`, `https://habitica.com/static/faq`.
2. **LifeUp / ulives**
   - Strong: customizable Attributes, Skill XP, coins, achievements, focus/Pomodoro rewards and real-life reward shop.
   - Avoid: configuration overload and systems that become detached counters.
   - Sources: `https://docs.lifeupapp.fun/zh-cn/`, `https://app.ulives.io/`.
3. **Finch**
   - Strong: gentle onboarding, achievable daily goals, Energy as daily purpose, supportive recovery and customization.
   - Avoid: childlike companion tone for this persona.
   - Sources: `https://help.finchcare.com/hc/en-us/articles/37935669335309-Our-Approach-to-Self-Care`, `https://help.finchcare.com/hc/en-us/articles/37780134479757-Energy-vs-Rainbow-Stones`.
4. **Amazing Marvin**
   - Strong: Daily Plan, Super Focus Mode, time tracking, sequential projects, modular strategies for procrastination and overwhelm.
   - Avoid: presenting hundreds of options at once.
   - Source: `https://help.amazingmarvin.com/en/collections/1139197-strategies`.

Use `docs/FREELANCER_LIFE_RPG_SYSTEM_V3.md` as system input, but audit it critically. Preserve useful decisions; correct contradictions, excessive complexity and mojibake.

# REBUILD STRATEGY

The existing prototype must remain available as a reference and save-data source. Do not delete or overwrite it during the rebuild.

Plan a new clean implementation under a dedicated directory such as `v4/` or `app-v4/`, with a later controlled cutover. The rebuild remains HTML/CSS/Vanilla JavaScript and localStorage-first.

Define:

- exact directory structure;
- module boundaries;
- state/repository interfaces;
- how V2 state is imported/migrated only after the new vertical slice passes;
- how legacy code stays isolated and is never imported into the new app accidentally;
- how the final root cutover and rollback will work.

# CORE PRODUCT THESIS

The product is a **Spider-Verse Freelancer Operations RPG**.

The Home screen has one job: answer “What should I do next, and why does it matter?”

The canonical loop is:

`Daily briefing → choose Today Loadout → run/complete real action → transparent reward breakdown → project encounter advances → build becomes stronger → weekly review adjusts strategy`.

No card click, gallery interaction, map marker, animation or sound can grant durable progress.

# REQUIRED INFORMATION ARCHITECTURE

Reduce the primary navigation to a small mature structure. Propose one canonical grouping, for example:

- **Command** — Home / Today / Focus.
- **Campaigns** — Projects / Encounters / Map.
- **Build** — Character / Loadout / Skill Web.
- **Archive** — Spider-Verse / Suits / Gadgets / Allies / Villains.
- **Review** — Weekly Review / Rewards / Settings.

Do not place 14 equal-weight destinations permanently in the main sidebar. Define desktop and mobile navigation.

# VISUAL DIRECTION

Create one distinctive design direction, not several vague options.

## Subject

Peter Parker's mature freelance operations station intersecting with a fractured Spider-Verse. Materials: red acetate map overlays, cyan oscilloscope signals, off-white field reports, black webbing, photo contact sheets, suit telemetry and dimensional portal refraction.

## Required aesthetic risk

Use a **split physical/digital evidence-board system**:

- productivity content reads like disciplined field reports and client dossiers;
- encounter/build content cuts through it with luminous dimensional Spider-Verse layers;
- one signature “Web of Consequence” visualization links today's action to client/project, attribute, active card effects and boss impact.

Avoid generic dark SaaS dashboard, constant neon borders, excessive glassmorphism, giant stat cards, emoji navigation and random comic-book explosions.

## Required token plan

Define exact:

- 5–7 color tokens with hex values and roles;
- display, body and utility typefaces with locally viable fallbacks;
- spacing scale;
- corner/radius policy;
- borders, shadows and elevation;
- motion durations/easings;
- icon strategy without emoji;
- image ratios and crop rules;
- responsive breakpoints.

## Wireframes

Provide compact ASCII wireframes for:

1. Desktop Home;
2. Mobile Home;
3. Today/Focus flow;
4. Loadout;
5. Archive gallery + large card viewer;
6. Project/Boss encounter;
7. Weekly Review.

# ASSET AND CHARACTER-IMAGE POLICY

The current wrong/reused images must not be carried into the new app.

Define an asset manifest schema with:

- exact entity ID;
- canonical display name;
- asset type;
- local source path;
- source/provenance;
- subject match verification status;
- generated/official/reference classification;
- crop focal point;
- fallback asset;
- reviewer/date.

Rules:

1. No remote image appears in V4 unless subject identity was manually verified.
2. Do not use a generic Spider-Man image for a different Spider-Person.
3. Prefer a small verified launch roster over hundreds of incorrect cards.
4. Launch vertical slice roster:
   - Peter Parker;
   - Miles Morales;
   - Ghost-Spider;
   - Spider-Man 2099;
   - Spider-Punk;
   - Spider-Man Noir;
   - Doctor Octopus;
   - one Ally;
   - four Suits;
   - six Skills;
   - two Gadgets.
5. Generated original fan art must be labeled clearly and must not imitate a named artist or exact Marvel SNAP layout.
6. Every card face is image + name; gameplay data appears in the detail/loadout layer.

# GAMEPLAY CONTENT ROLES

Define one real gameplay role for each category:

- Identity: build archetype / domain affinity;
- Suit: primary passive rule;
- Skill: purchased permanent rule or action conversion;
- Gadget: limited-use tactical modifier on a legitimate action;
- Ally: planning/support rule with cooldown or condition;
- Villain: project encounter rules;
- Spider-Verse Archive: collection and build discovery, never direct reward source.

Define the launch vertical slice effects for the exact small roster above. Every effect must be explainable in the reward breakdown.

# REQUIRED OUTPUTS

Create:

1. `docs/V4_PRODUCT_REBUILD_BLUEPRINT.md`
2. `docs/V4_VISUAL_SYSTEM.md`
3. `docs/V4_INFORMATION_ARCHITECTURE.md`
4. `docs/V4_ASSET_MANIFEST_POLICY.md`
5. `docs/V4_ROADMAP.md`
6. `tasks/TASK_22_V4_APP_SHELL_HOME_VERTICAL_SLICE.md`

# ROADMAP REQUIREMENTS

Use small milestones:

1. Foundation, tokens, shell, clean repository and sample data.
2. Home/Today/Focus vertical slice.
3. Reward + effect engine and explainable result panel.
4. Character/loadout with small verified roster.
5. Projects/encounters/loot.
6. Archive expansion using verified asset manifest.
7. Map, sound and effects.
8. V2 migration, balancing and cutover.

Each milestone must have exit criteria and explicit non-goals.

# ACCEPTANCE CRITERIA

- Four reference products are compared with adopt/avoid decisions.
- One decisive product architecture and visual direction is selected.
- Navigation is reduced and hierarchical.
- Asset policy prevents wrong-character images.
- Cards/Suits/Skills/Gadgets/Allies each have distinct mechanical roles.
- New build is isolated from legacy code and has a rollback/cutover plan.
- Task 22 is a small, executable first implementation task, not a giant rebuild.
- No application code is modified in Task 21.

# DO NOT

- Do not modify current application code.
- Do not delete legacy files or user saves.
- Do not call terminal/command tools.
- Do not create another generic dashboard design.
- Do not retain the existing 14-item flat sidebar.
- Do not include unverified character images in the launch roster.
- Do not add backend/auth/framework/build tooling.
