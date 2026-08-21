# TASK

Mass Content Expansion, Licensed-Source Artwork Integration, City Map, and Sound Pass

# OBJECTIVE

Expand the current Spider-Man Life RPG prototype into a content-rich compendium and mission map. Use Marvel Snap card artwork references for characters, and visual references from Marvel's Spider-Man (2018), Marvel's Spider-Man 2, and Marvel's Spider-Man: Miles Morales for suits, gadgets, skills, and moves. Implement this in the existing vanilla HTML/CSS/JS application without breaking the V2 progression architecture.

# USER INTENT

The user explicitly wants:

- many real Spider-Man villains;
- many allies;
- many Spider-Verse Spider variants;
- Marvel Snap artwork for character cards;
- suit, gadget, skill, and move imagery inspired by the three Insomniac Spider-Man games;
- the City Map and sound work from the prior request;
- Antigravity to perform the implementation.

# CONTEXT

Read `docs/PRODUCT_ARCHITECTURE.md`, all `docs/IMPLEMENTATION_NOTES_TASK_*.md`, and Tasks 01-03 before editing. The active application loads `data/*.js` and `js/*.js`. Root `app.js` is legacy and MUST NOT be edited. V2 persistence, action ledger, loot idempotency, declarative boss mechanics, builds, mastery, and real-life-action-only progression must remain intact.

Reference UX already audited at `https://spideytracker.com/` (redirects to `.net`): its useful patterns are an in-universe tracker device, sound choice before interaction, a map with typed markers, filters, activity log, contextual panels, and radar/scan feedback. Take inspiration only; do not copy Sony code, layouts, logos, audio, or site assets.

# WORKING RULES

1. Work autonomously using file-edit and browser tools. Do not use shell/run-command tools because headless command approval cannot be granted.
2. Inspect the current schemas and rendering paths before modifying them.
3. Preserve all user save data with merge-default migrations.
4. No backend, framework, bundler, package manager, or build step.
5. Keep durable rewards tied only to legitimate real-life actions through GameEngine.

# ARTWORK AND PROVENANCE POLICY

The app is a personal fan prototype, but implement assets responsibly:

1. Do not scrape, rip, reverse-engineer, or package proprietary game files.
2. Do not copy code/audio/assets from `spideytracker.com`.
3. For exact character art, use stable, publicly accessible Marvel Snap card-art/image URLs only when their provenance can be identified. Prefer an official/public API or established public card database. Do not guess URLs.
4. For Insomniac suits/gadgets/skills/moves, use official promotional screenshots, press/media imagery, or clearly attributable public wiki/reference imagery. Do not extract game files.
5. Create `data/media.js` or equivalent as a centralized media catalog. Every remote image entry must include at least `src`, `sourceUrl`, `sourceName`, and `fallback`.
6. Add `docs/ASSET_CREDITS.md` listing every source/domain and the fan-project/non-commercial disclaimer.
7. Never hotlink without graceful fallback. Use `loading="lazy"`, fixed aspect ratios, `object-fit`, error fallback, and prevent broken-image icons. Existing code-native SVG avatars may be retained as fallbacks.
8. If a reliable/legal exact image cannot be sourced, use the existing original SVG/emoji fallback and document the missing artwork. Do not fabricate attribution.

# CONTENT TARGETS

Add meaningful, data-driven content while keeping mechanics generic:

## Villains

- Minimum 30 villains total.
- Include street, science, symbiote, crime, multiverse, and supernatural categories.
- Must include at least: Doctor Octopus, Green Goblin, Venom, Carnage, Mysterio, Kraven, Lizard, Sandman, Electro, Vulture, Rhino, Scorpion, Shocker, Kingpin, Mister Negative, Tombstone, Hammerhead, Taskmaster, Prowler, Tinkerer, Spot, Morbius, Chameleon, Hobgoblin, Jackal, Hydro-Man, Molten Man, Scream, Knull, and Morlun.
- All entries need stable IDs, names, universe/category tags, short Vietnamese descriptions, portrait/media reference, and safe encounter defaults.
- Only the existing supported encounter mechanics should be executable. Extra villains may share generic mechanic descriptors; do not add villain-specific UI branches.
- Villain list needs search and filters (category, universe, difficulty) plus a detail panel.

## Allies

- Minimum 24 allies total.
- Include MJ, Aunt May, Uncle Ben, Harry Osborn, Gwen Stacy, Miles Morales, Ganke Lee, Yuri Watanabe, Black Cat, Silver Sable, Wraith, Daredevil, Human Torch, Wolverine, Deadpool, Doctor Strange, Iron Man, Captain America, Luke Cage, Jessica Jones, Cloak, Dagger, Silk, and Spider-Woman.
- Centralize in a new `data/allies.js` if not present. Stable IDs, role/category, universe, Vietnamese descriptions, media reference, and existing companion modifier schema where applicable.
- Allies screen needs search/filter/detail and must preserve equip behavior.

## Spider-Verse variants

- Minimum 18 playable/display variants total.
- Include Peter Parker, Miles Morales, Spider-Gwen/Ghost-Spider, Spider-Man 2099, Spider-Man Noir, Spider-Punk, Peni Parker/SP//dr, Pavitr Prabhakar, Spider-Ham, Scarlet Spider (Ben Reilly), Scarlet Spider (Kaine), Superior Spider-Man, Silk, Spider-Woman (Jessica Drew), Spider-Man India, Spider-Man UK, Cosmic Spider-Man, and Symbiote Spider-Man.
- Put these in a dedicated data module and surface them in Character or Collection with search/filter/detail.
- A variant is cosmetic/build identity only unless it declares modifiers using the generic Build schema. No direct reward grants.

## Suits, gadgets, skills, and moves

- Expand to at least 18 suits, 16 gadgets, and 28 skills/moves total across branches.
- Cover recognizable items/abilities from Marvel's Spider-Man (2018), Miles Morales, and Spider-Man 2: web shooters, impact web, web bomb, spider drone, electric web, suspension matrix, trip mine, concussive blast, gravity well, remote mine, holo-drone, venom punch, venom dash, venom jump, mega venom blast, camouflage, web grabber, ricochet web, sonic burst, upshot, symbiote punch, symbiote blast, symbiote yank, spider rush, spider barrage, web whip, web slam, parry, perfect dodge, finishers, traversal launch/slingshot, loop-de-loop, and web wings.
- Data must state `gameSource` and `sourceLabel` for reference/credit.
- Preserve generic modifiers and balance. Visual collection entries may be non-functional when no generic modifier is appropriate; label them clearly rather than faking gameplay.

# CITY MAP MODULE

Add a 14th navigation screen named `CITY MAP`.

1. Build an original code-native SVG/CSS New York-style mission map; do not use Google/Mapbox or copy the reference site's world map.
2. Add 6-8 districts with typed nodes: active mission, project, boss threat, ally intel, locked, completed.
3. Marker colors/shapes must be redundant with labels/icons for accessibility.
4. Provide search/filter or filter chips, a contextual side panel, a compact activity log, center-map control, and keyboard-accessible markers.
5. Selecting a node opens details; launching it navigates to the existing Quest, Project, Boss, Ally, or Villain screen. Map interaction itself must never mint XP/Gold/loot or defeat a boss.
6. Store only lightweight map UI state (selected district/filter) with safe defaults. Do not store derived progression redundantly.
7. The signature visual should be an original Oscorp-style patrol scanner/radar sweep integrated into the existing visual language, with restrained motion and `prefers-reduced-motion` support.

# SOUND PASS

Extend/refactor the existing synthesized Web Audio system; do not copy or download audio from games or the reference site.

1. Centralize SFX with named cues: UI focus/click, panel open/close, tracker scan, map marker ping, web thwip, danger alert, equip, unlock, success, failure, boss phase, and loot reveal.
2. Add separate persisted `musicEnabled` and `sfxEnabled` settings plus conservative volume defaults.
3. Never autoplay before a user gesture. Initialize/resume AudioContext only after interaction.
4. Map screen gets a subtle original scan ambience/pulse, not a copyrighted melody or game sample.
5. Respect mute state and reduced motion. UI remains fully usable with sound off.

# UI/UX

1. Keep the existing dark Spider-tech identity, but make card artwork the visual hierarchy: consistent portrait ratios, readable overlays, rarity/category chips, and restrained holographic treatment.
2. Add reusable media-card rendering helpers; do not duplicate large render branches.
3. All expanded galleries require search, meaningful filters, zero-result messaging, and a detail view/modal.
4. Responsive at 360px and desktop. Avoid huge DOM cost: lazy images, event delegation where practical, no eager rendering of hidden heavy panels.
5. Visible keyboard focus, useful alt text, buttons with accessible names, no hover-only information.
6. Repair any mojibake/encoding touched in modified files.

# FILES

Likely files: `index.html`, `styles.css`, `js/app.js`, `js/storage.js`, existing systems, `data/villains.js`, `data/suits.js`, `data/gadgets.js`, `data/skills.js`, new `data/allies.js`, new `data/variants.js`, new `data/map.js`, new `data/media.js`, `docs/ASSET_CREDITS.md`, and `docs/IMPLEMENTATION_NOTES_TASK_04.md`. Modify only what is needed. Do not edit root `app.js`.

# ACCEPTANCE CRITERIA

- At least 30 villains, 24 allies, 18 Spider-Verse variants, 18 suits, 16 gadgets, and 28 skills/moves are visible and searchable.
- Character cards display sourced art where reliable and automatically fall back without broken images.
- Each remote asset has centralized provenance and credits documentation.
- CITY MAP is the 14th working screen; filters, marker details, routing, keyboard access, and responsive layout work.
- Sound/music preferences persist; no autoplay-policy errors; mute works; original synthesized cues fire on the intended interactions.
- Existing equip/select/encounter/progression/migration flows still work.
- No durable reward can be created by gallery, map, sound, QTE, or cosmetic interaction.
- No console errors, all loaded JS parses, no horizontal overflow at 1280px and 360px.

# TEST

Perform browser-based QA using available browser tools:

1. Fresh install and existing V2 save merge.
2. Count content targets from runtime data and rendered lists.
3. Search and every filter for villains, allies, variants, suits/gadgets/skills.
4. Open several detail views with successful art and forced fallback art.
5. Test every City Map node type, routing, focus, and no-reward invariant.
6. Toggle sound/music, reload, verify persistence and no autoplay error.
7. Navigate all 14 screens at desktop and 360px; check overflow and console.
8. Parse every loaded JavaScript file.

# DELIVERABLE

Implement the complete scope, then write `docs/IMPLEMENTATION_NOTES_TASK_04.md` with changed files, content counts, artwork sources/fallbacks, tests performed, limitations, and any entries still using fallback art.

