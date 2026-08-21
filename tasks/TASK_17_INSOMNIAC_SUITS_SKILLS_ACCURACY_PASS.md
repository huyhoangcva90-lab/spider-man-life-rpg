# TASK

Insomniac Suits & Skills Accuracy Pass — Spider-Man 2018, Miles Morales and Spider-Man 2

# OBJECTIVE

Rebuild the Suits Studio and Skills & Moves catalog so their primary reference system accurately reflects the three Insomniac game releases requested by the user:

1. `Marvel's Spider-Man (2018) / Remastered`
2. `Marvel's Spider-Man: Miles Morales`
3. `Marvel's Spider-Man 2`

The UI must make game source and playable hero clear in the large viewer and filters while compact cards remain image + name only.

# CONTEXT

TASK 15–16 created 30 Suits and 44 Skills with portrait-first cards and stable-ID save merging. Preserve that work, all V2 progression, owned/unlocked/equipped state, 36 Spider-People, 26 Allies, City Map and the 12 synthesized sound cues.

Current data contains several generic/comic/animation items mixed into the Insomniac catalog, and some labels/descriptions are approximate. This task is an accuracy and taxonomy pass, not a license to reset saves or fake exact game mechanics.

The active controller is `js/app.js`; root `app.js` is legacy and MUST NOT be edited. This headless Antigravity run has workspace read/write only. Do not invoke terminal/command tools.

# AUTHORITATIVE REFERENCE BASELINE

Use these supplied official PlayStation/Insomniac references as the primary source baseline:

- Spider-Man Remastered overview: `https://www.playstation.com/en-us/games/marvels-spider-man-remastered/`
- Remastered PC feature/pre-purchase article confirming Iron Spider, Spider-Punk, Velocity, Spider-Drone and skill points: `https://blog.playstation.com/2022/07/20/marvels-spider-man-remastered-pc-features-revealed/`
- Miles Morales overview confirming bio-electric Venom attacks, camouflage, web traversal, gadgets and skills: `https://www.playstation.com/en-us/games/marvels-spider-man-miles-morales/`
- Spider-Man 2 overview confirming Peter/Miles switching, Symbiote powers, Thunder Burst, Tendril Slam, Web Line and Web Wings: `https://www.playstation.com/en-us/games/marvels-spider-man-2/`
- Spider-Man 2 official support confirming Arachknight, Shadow-Spider, Web Grabber and Digital Deluxe suits: `https://www.playstation.com/en-us/support/games/marvels-spider-man-2-support/`
- Spider-Man 2 PlayStation guide confirming three skill trees: Peter, Miles and Shared; Peter Spider-Arms/Symbiote; Miles bio-electric/camouflage: `https://www.playstation.com/fr-fr/games/marvels-spider-man-2/whats-new-in-marvels-spider-man-2/`
- Insomniac/PlayStation update confirming ability swapping between Symbiote and Spider-Arms: `https://blog.playstation.com/2024/06/11/marvels-spider-man-2-update-includes-suit-collab-and-fan-favorites-available-june-18/`
- Insomniac 2026 release notes for Fresh Start and Marvel Tōkon suits: `https://support.insomniac.games/hc/en-us/articles/53862549566227-Release-Notes-v1-005-000`

When an exact suit/skill name is not verified by supplied official sources, label it `inspiredBy` rather than claiming it is an exact in-game item. Do not fabricate official provenance.

# FILES

Modify only as needed:

- `data/suits.js`
- `data/skills.js`
- `data/media.js`
- `js/storage.js`
- `js/app.js`
- `index.html`
- `styles.css`
- `docs/ASSET_CREDITS.md`
- `docs/IMPLEMENTATION_NOTES_TASK_17.md`

# SUIT DATA MODEL

Normalize every suit with:

```js
{
  id,
  name,
  gameId: "sm2018" | "miles2020" | "sm2" | "other",
  gameSource,
  sourceType: "verified-official" | "verified-in-game-reference" | "inspired-by",
  sourceUrl,
  playableHero: "peter" | "miles" | "both",
  suitFamily,
  mediaId,
  description,
  modifiers,
  unlocked
}
```

Preserve legacy IDs wherever possible. If correcting an ID is unavoidable, add an explicit legacy ID migration.

# SKILL DATA MODEL

Normalize every skill/move with:

```js
{
  id,
  name,
  gameId: "sm2018" | "miles2020" | "sm2" | "other",
  gameSource,
  sourceType,
  sourceUrl,
  playableHero: "peter" | "miles" | "shared",
  abilityFamily: "traversal" | "combat" | "web" | "gadget" | "stealth" | "venom" | "camouflage" | "spider-arms" | "symbiote" | "defense",
  branch,
  mediaId,
  description,
  modifiers,
  unlocked
}
```

# CONTENT REQUIREMENTS

## Spider-Man 2018 / Remastered

Represent Peter's recognizable content accurately, including meaningful coverage of:

- Classic, Advanced 1.0, Anti-Ock, Iron Spider, Spider-Punk, Velocity, Noir, Scarlet Spider, Secret War, Stark, Negative, Homemade, Dark, ESU and available Spider-Armor/2099 families already present in the app.
- Traversal/combat such as Perfect Dodge, Point Launch, Web Strike, Air Launch, Yank/Throw, Finisher and environmental/web combat.
- Gadget-linked moves may be tagged `gadget`; do not duplicate the Gadgets screen unnecessarily.

## Miles Morales

Represent Miles-specific content accurately, including meaningful coverage of:

- Classic Miles, TRACK, Crimson Cowl, The End, 2020, Programmable Matter, Purple Reign, Winter, Bodega Cat, Uptown Pride, Advanced Tech and other currently supported Miles suits when verified.
- Venom Punch, Venom Dash, Venom Jump, Mega Venom Blast, Venom Smash/related bio-electric moves, camouflage, stealth takedowns and traversal.
- Use `playableHero: "miles"`; do not assign Miles Venom bio-electric skills to Peter.

## Spider-Man 2

Represent the sequel's two-hero/shared taxonomy accurately:

- Peter: Advanced 2.0, Black/Symbiote, Anti-Venom, Arachknight and verified Peter suits.
- Miles: Upgraded, Evolved, Shadow-Spider and verified Miles suits.
- Peter ability families: Spider-Arms and Symbiote/Anti-Venom.
- Miles ability families: evolved bio-electric Venom and camouflage.
- Shared: traversal/combat including Web Wings, Slingshot Launch and Web Line where appropriate.
- Required recognizable moves: Thunder Burst, Tendril Slam, Symbiote Punch, Symbiote Blast, Symbiote Yank, Spider Rush, Spider Barrage, Web Grabber-related interaction and Web Line.

# UI

1. Compact Suit/Skill cards remain artwork + visible name only. Do not reintroduce numbers or metadata on compact faces.
2. Add Suit filters:
   - Game: All / Spider-Man 2018 / Miles Morales / Spider-Man 2 / Other
   - Hero: All / Peter / Miles / Both
   - ownership/equipped if already supported.
3. Add Skill filters:
   - Game
   - Hero: Peter / Miles / Shared
   - ability family.
4. Large viewer shows game source, playable hero, ability/suit family, verified/inspired badge and direct source link.
5. Provide meaningful zero-result states and keyboard accessible filters/cards.
6. Correct touched Vietnamese text to valid UTF-8; remove mojibake in touched Suit/Skill UI.

# MEDIA

1. Suit and skill images should be character/art-first, with fixed ratios and graceful fallback.
2. Prefer existing working official/public promotional references already cataloged.
3. If exact official media is unavailable, use an original generated/fallback illustration and label it fan artwork or inspired-by; never mislabel it as an official screenshot.
4. Do not scrape/rip game files or copy UI icons directly from packaged assets.

# GAME LOGIC

- Source taxonomy and browsing never grant progression.
- Do not auto-unlock newly added/corrected suits or skills.
- Existing unlocked/equipped state survives data corrections and reload.
- Modifiers remain generic Life RPG modifiers; descriptions must distinguish game-reference flavor from actual implemented effects.
- Skill unlock and suit equip continue through authoritative engine methods.
- No direct state mutation in archive modal actions.

# ACCEPTANCE CRITERIA

- Every Suit and Skill has `gameId`, `gameSource`, `sourceType`, `sourceUrl`, `playableHero` and family metadata.
- Filters produce correct Peter/Miles/Shared and three-game groupings.
- Miles Venom/camouflage content is not attributed to Peter.
- Peter Spider-Arms/Symbiote content and SM2 shared tree are distinct.
- Approximate/non-game content is labeled `other` or `inspired-by`, not falsely official.
- Compact cards remain image + name only; large viewer contains provenance/details.
- Existing V2 save still renders at least 30 Suits and 44 Skills without losing unlock/equip state.
- No progression changes from browsing; no console errors; all 14 screens work; JavaScript parses; 360px layout has no overflow.

# TEST

Use browser/file tools only:

1. Count runtime/rendered Suits and Skills on an existing V2 save.
2. Exercise every game, hero and family filter.
3. Open one Peter, one Miles and one Shared entry from each relevant game; verify large-view metadata and source link.
4. Confirm compact card `innerText.trim()` equals only the item name.
5. Equip one already-owned suit and unlock a legitimately eligible skill through engine paths; reload and confirm persistence.
6. Confirm locked content remains locked and browsing does not change XP, Gold, ledger or boss HP.
7. Navigate all 14 screens and inspect console at desktop and 360px.

# DO NOT

- Do not edit root `app.js`.
- Do not call terminal/command tools.
- Do not claim unofficial names/media are official.
- Do not reset save data or auto-unlock content.
- Do not copy/rip proprietary game assets or audio.
- Do not add backend/framework/build tooling.

# DELIVERABLE

Implement the complete pass and write `docs/IMPLEMENTATION_NOTES_TASK_17.md` with exact counts per game/hero/family, source classifications, changed IDs/migrations, browser tests actually performed and known limitations.
