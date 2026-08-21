# TASK

Portrait-First Spider Archive — Separate Galleries, Large Card Viewer, More Spider-Verse, Suits, Skills and Sound

# OBJECTIVE

Reshape the current content experience around character artwork and names. Remove game-stat numbers from gallery card faces, open every card into a large cinematic viewer, separate Spider-People from Allies, expand Spider-Verse/Suits/Skills, and deepen the original Spider-inspired sound system.

# USER DIRECTION

- The user does not want cost/power/stat numbers on character card faces.
- The primary card face is image + character name.
- Clicking/tapping a card opens a substantially larger card/detail view.
- Spider-People / Spider-Verse must be a separate collection from Allies.
- Add more Spider-Verse characters because Allies alone is insufficient.
- Add more skills and suits.
- Use original fan-made/generated portrait assets where supplied; do not imitate a named living artist or copy an existing Marvel SNAP card composition exactly.
- Add more original synthesized Spider-inspired sounds.

# CONTEXT

TASK 01–10 are implemented. Preserve V2 progression, action ledger, idempotent loot, 14-screen navigation, current map, all existing working media and fallbacks. Active controller is `js/app.js`; root `app.js` is legacy and MUST NOT be edited.

Read `docs/PRODUCT_ARCHITECTURE.md`, existing task notes and current data/rendering before editing. This headless run has workspace read/write permission only. Do not call terminal/command tools.

# FILES

Modify only as needed:

- `index.html`
- `styles.css`
- `js/app.js`
- `js/storage.js`
- `data/variants.js` or a new `data/spider-people.js`
- `data/allies.js`
- `data/villains.js`
- `data/suits.js`
- `data/skills.js`
- `data/media.js`
- `docs/ASSET_CREDITS.md`
- `docs/IMPLEMENTATION_NOTES_TASK_15.md`

# INFORMATION ARCHITECTURE

Create five clearly separated portrait collections:

1. **SPIDER-VERSE / SPIDER-PEOPLE** — playable/display Spider identities only.
2. **ALLIES** — non-Spider partners, mentors and heroes.
3. **VILLAINS** — enemies and boss-capable entries.
4. **SUITS** — costume/equipment collection.
5. **SKILLS & MOVES** — ability/move collection.

Do not duplicate the same identity between Spider-People and Allies unless the entry represents a meaningfully different role and the UI explains it.

# CONTENT TARGETS

1. Expand Spider-People to at least **36** meaningful entries spanning comics, animation, games and multiverse identities. Include the existing 18 and add recognizable identities such as Spider-Man 2099, Spider-Punk, Noir, Peni/SP//dr, Pavitr, Spider-Ham, Mayday Parker, Annie May Parker, Spider-Man 2211, Spider-Man Unlimited, Spider-Byte, Sun-Spider, Web-Weaver, Night-Spider, Araña, Julia Carpenter, Madame Web, Spiderling and other appropriate Spider variants.
2. Preserve at least 24 Allies but remove/reclassify Spider identities from the primary Allies presentation when appropriate. Backfill with meaningful non-Spider allies so the Allies count and role diversity remain strong.
3. Expand Suits from 18 to at least **30** entries, with stable IDs, source labels, era/game tags, visual media references/fallbacks and generic modifiers only where already supported.
4. Expand Skills/Moves from 28 to at least **44** entries across traversal, web combat, gadgets, stealth, venom bio-electric, symbiote and defensive branches.
5. Do not add empty filler. Every entry needs stable ID, correct collection type, concise Vietnamese description, tags/source label and media/fallback.

# CARD FACE DESIGN

1. Character gallery cards show only:
   - dominant portrait artwork;
   - character name;
   - one subtle category/status chip only when essential.
2. Remove/hide cost, power, HP, armor, numeric stat grids and other numbers from the compact card face. Numeric data may remain inside the expanded detail view when it has actual gameplay meaning.
3. Use consistent portrait ratio, readable bottom nameplate, restrained holographic edge and hover/focus depth.
4. Do not make the visual an exact Marvel SNAP card clone. Use an original Spider Archive frame language.

# LARGE CARD VIEWER

1. Clicking/tapping/Enter/Space on any portrait card opens a large modal/lightbox viewer.
2. Viewer includes large artwork, name, collection, universe/source, description, tags, and relevant gameplay details/actions.
3. Previous/next controls cycle through the current filtered result set.
4. Support Escape close, focus trap, focus return, swipe gesture where practical and accessible button labels.
5. Image load failure swaps to fallback without broken-image icon.
6. At 360px the modal becomes a full-screen sheet with unclipped close/action controls.

# GENERATED ART PIPELINE

1. Add media support for project-local generated portraits under `assets/generated/portraits/`.
2. Generated artwork metadata must include `generated: true`, prompt family/version, creation tool label and fan-project disclaimer.
3. Prefer supplied local generated portraits over remote URLs; fall back to existing sourced media, then code-native fallback.
4. Do not claim an image is official. Clearly distinguish “Generated fan artwork” from official/public promotional references.
5. Do not block implementation if generated images are not yet present; architecture and fallback must work first.

# SOUND

Extend the existing synthesized Web Audio system with original named cues:

- `webThwipLight`
- `webThwipHeavy`
- `webSwingLaunch`
- `webSwingRelease`
- `spiderSensePulse`
- `suitTechOpen`
- `suitEquipLock`
- `venomCharge`
- `venomImpact`
- `symbioteTendril`
- `cardExpand`
- `cardCollapse`

Use oscillator/noise/filter/envelope synthesis only. No downloaded or copied movie/game audio. Respect SFX mute, volume, first-gesture policy and reduced-motion/reduced-effects settings.

# GAME LOGIC

- Gallery browsing, expanding a card, changing filters, reclassification and sound previews never grant XP/Gold/loot, damage or encounter progression.
- Preserve equip/unlock rules; do not unlock all suits or skills simply because they are visible in the archive.
- Keep static definitions separate from mutable owned/equipped state.
- Merge new defaults into existing V2 saves without resetting progress.

# ACCEPTANCE CRITERIA

- Compact portrait cards contain artwork + name and no stat-number clutter.
- Every portrait card opens an accessible large viewer with previous/next navigation.
- Spider-People, Allies, Villains, Suits and Skills are clearly separated.
- Runtime/rendered targets: at least 36 Spider-People, 24 Allies, 30 Suits and 44 Skills/Moves.
- New local generated-portrait media path and attribution schema work with fallback.
- All 12 named synthesized cues exist and obey preferences/autoplay rules.
- No browsing interaction creates durable progression.
- Existing 14 screens and map still work; no console errors or horizontal overflow at desktop/360px.
- All loaded JavaScript parses.

# TEST

1. Verify runtime and rendered collection counts.
2. Search/filter each collection and confirm zero-result states.
3. Open first/middle/last card in each collection; test previous/next, Escape, focus return and fallback image.
4. Confirm compact cards have no numeric stat/cost/power text.
5. Verify generated-local → sourced-remote → code-fallback media priority.
6. Trigger every new sound after a user gesture; mute/reload and verify persistence.
7. Verify equip/unlock/progression invariants and no reward mutation from browsing.
8. Navigate all 14 screens at desktop and 360px; check console and overflow.

# DO NOT

- Do not edit root `app.js`.
- Do not copy Marvel SNAP’s exact frame/layout or a named artist’s style.
- Do not scrape/rip game assets or download copyrighted sound samples.
- Do not add a backend, framework, bundler or package manager.
- Do not reset saves or auto-unlock new content.
- Do not call shell/terminal/command tools in the headless run.

# DELIVERABLE

Implement the full scope and write `docs/IMPLEMENTATION_NOTES_TASK_15.md` with exact counts, changed files, generated-media integration, sound cue list, tests actually performed and limitations.
