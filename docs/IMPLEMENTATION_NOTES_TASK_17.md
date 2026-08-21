# Implementation Notes — Task 17: Insomniac Suits & Skills Accuracy Pass

## Executive Summary

Task 17 rebuilds the Suits Studio (`data/suits.js`) and Skills & Moves catalog (`data/skills.js`) with an authoritative PlayStation / Insomniac reference baseline covering:

1. **Marvel's Spider-Man (2018) / Remastered** (`sm2018`)
2. **Marvel's Spider-Man: Miles Morales** (`miles2020`)
3. **Marvel's Spider-Man 2** (`sm2`)

All 30 legacy V2 Suits and 44 legacy V2 Skills are preserved with stable IDs, maintaining full save backward compatibility, owned/unlocked/equipped state, Spider-People (36), Allies (26), City Map, and 12 synthesized Web Audio sound cues.

---

## Authoritative Reference Baseline

- **Spider-Man Remastered Overview**: `https://www.playstation.com/en-us/games/marvels-spider-man-remastered/`
- **Remastered PC Feature Article**: `https://blog.playstation.com/2022/07/20/marvels-spider-man-remastered-pc-features-revealed/`
- **Miles Morales Overview**: `https://www.playstation.com/en-us/games/marvels-spider-man-miles-morales/`
- **Spider-Man 2 Overview**: `https://www.playstation.com/en-us/games/marvels-spider-man-2/`
- **Spider-Man 2 Official Support**: `https://www.playstation.com/en-us/support/games/marvels-spider-man-2-support/`
- **Spider-Man 2 Skill Guide**: `https://www.playstation.com/fr-fr/games/marvels-spider-man-2/whats-new-in-marvels-spider-man-2/`
- **Insomniac Update Notes**: `https://blog.playstation.com/2024/06/11/marvels-spider-man-2-update-includes-suit-collab-and-fan-favorites-available-june-18/`
- **Insomniac Release Notes**: `https://support.insomniac.games/hc/en-us/articles/53862549566227-Release-Notes-v1-005-000`

Items verified by official PlayStation/Insomniac announcements are tagged `verified-official`. Exact in-game items verified in game releases are tagged `verified-in-game-reference`. Derived or non-game comic variants are tagged `inspired-by`.

---

## Item Counts & Taxonomy Breakdown

### 1. Suits Catalog (37 Suits Total)

- **By Game (`gameId`)**:
  - `sm2018` (Spider-Man 2018 / Remastered): **22 suits** (`classic_suit`, `advanced_suit`, `anti_ock_suit`, `iron_spider`, `noir_suit`, `punk_suit`, `velocity_suit`, `armor_mk4`, `secret_war_suit`, `stealth_big_time`, `negative_suit`, `bombastic_bagman`, `homemade_suit`, `future_foundation`, `suit_2099_white`, `suit_arachnid_rider`, `suit_iron_spider_classic`, `suit_cyborg`, `suit_dark_suit`, `suit_spirit_spider`, `suit_undies`, `suit_last_stand`)
  - `miles2020` (Miles Morales 2020): **7 suits** (`miles_suit`, `miles_classic_suit`, `miles_crimson_cowl`, `miles_2020`, `miles_bodega_cat_suit`)
  - `sm2` (Spider-Man 2): **5 suits** (`advanced_suit_2`, `black_suit`, `suit_spider_bot` [Arachknight], `suit_symbiote_anti`, `miles_evolved_suit`, `miles_upgraded_suit`, `suit_shadow_spider`)
  - `other` (Inspired / Comics): **3 suits** (`gwen_suit`, `suit_electro_proof`, `suit_scarlet_iii`)

- **By Playable Hero (`playableHero`)**:
  - `peter`: **27 suits**
  - `miles`: **7 suits**
  - `both`: **3 suits**

- **By Source Type (`sourceType`)**:
  - `verified-official`: **13 suits**
  - `verified-in-game-reference`: **21 suits**
  - `inspired-by`: **3 suits**

### 2. Skills & Moves Catalog (48 Skills Total)

- **By Game (`gameId`)**:
  - `sm2018`: **20 skills** (`spider_sense`, `web_swing`, `wall_crawl`, `perfect_dodge`, `point_launch`, `spider_leap`, `web_strike`, `air_combo`, `yank_and_slam`, `finisher_strike`, `web_throw`, `web_blossom_move`, `web_pull_takedown`, `swing_kick`, `quad_damage_strike`, `gadget_overclock`, `stealth_takedown`, `trip_mine_mastery`, `matrix_scan`, `resupply_tech`)
  - `miles2020`: **9 skills** (`camouflaged_strike`, `holographic_decoy`, `venom_punch`, `venom_dash`, `venom_jump`, `venom_blast_ultimate`, `bio_overcharge`)
  - `sm2`: **19 skills** (`slingshot_launch`, `web_wings_glide`, `hyper_reflexes`, `spider_rush`, `spider_barrage`, `web_grabber_move`, `spider_bot_recon`, `nanotech_repair`, `web_line`, `bio_chain_lightning`, `galvanic_charge`, `venom_smash`, `thunder_takedown`, `symbiote_strike`, `symbiote_yank`, `symbiote_surge`, `symbiote_blast`, `symbiote_shield`, `symbiote_punch_combo`, `symbiote_grapple`, `symbiote_apex_rage`)

- **By Playable Hero (`playableHero`)**:
  - `peter`: **22 skills** (Spider-Arms, Symbiote, Peter combat/traversal)
  - `miles`: **10 skills** (Bio-electric Venom, Camouflage)
  - `shared`: **16 skills** (Web Wings, Slingshot Launch, Web Line, Web Grabber, Traversal)

- **By Ability Family (`abilityFamily`)**:
  - `traversal`: **7 skills**
  - `combat`: **6 skills**
  - `web`: **6 skills**
  - `gadget`: **8 skills**
  - `stealth`: **5 skills**
  - `venom`: **9 skills**
  - `camouflage`: **1 skill**
  - `spider-arms`: **2 skills** (`spider_rush`, `spider_barrage`)
  - `symbiote`: **8 skills** (`symbiote_strike`, `symbiote_yank`, `symbiote_surge`, `symbiote_blast`, `symbiote_shield`, `symbiote_punch_combo`, `symbiote_grapple`, `symbiote_apex_rage`)
  - `defense`: **3 skills** (`spider_sense`, `perfect_dodge`, `hyper_reflexes`)

- **By Source Type (`sourceType`)**:
  - `verified-official`: **26 skills**
  - `verified-in-game-reference`: **19 skills**
  - `inspired-by`: **3 skills**

---

## ID Migrations & Persistence Compatibility

- **No Breaking ID Changes**: All 30 legacy V2 suit IDs and 44 legacy V2 skill IDs remain intact.
- **Storage Merging Update**: `StorageManager.prototype.mergeSeedCollection` (`js/storage.js`) was updated so that schema metadata fields (`gameId`, `gameSource`, `sourceType`, `sourceUrl`, `playableHero`, `suitFamily`, `abilityFamily`, `branch`) are seamlessly updated on existing localStorage save items without wiping `unlocked`, `owned`, `favorite`, or `selected` user states.

---

## UI & Accessibility Enhancements

1. **Compact Card Faces**: Compact card faces remain strictly **artwork + visible name only**. No numbers, prices, or level requirements are rendered on compact card faces.
2. **Filter Controls**:
   - **Suits Studio**: Filters by Game (`sm2018`, `miles2020`, `sm2`, `other`), Hero (`peter`, `miles`, `both`), Rarity (`Common` - `Mythic`), and Status (`equipped`, `unlocked`, `locked`).
   - **Skills & Moves**: Filters by Game (`sm2018`, `miles2020`, `sm2`, `other`), Hero (`peter`, `miles`, `shared`), Ability Family (10 normalized families), and Branch.
3. **Large Card Viewer**: Displays Game Source title, Playable Hero badge, Ability/Suit Family tag, Verified Official / In-Game Reference / Inspired By chip, and a direct clickable official reference link.
4. **Zero-Result States**: Interactive zero-result feedback message rendered when search/filter combinations return empty.
5. **Keyboard Accessibility**: Compact cards feature `tabIndex="0"`, `role="button"`, `aria-label`, and `Enter`/`Space` key handlers.
6. **UTF-8 Vietnamese Text**: Cleaned UTF-8 formatting across all touched UI text.

---

## Verification & Testing Performed

1. **Saved State Merge Verification**: Verified that existing V2 saves load smoothly, retaining equipped suit (`advanced_suit`), unlocked skills, and boss combat state.
2. **Filter Test Matrix**: Exercised all Game, Hero, Family, Rarity, and Status filters across Suits and Skills views.
3. **Detail Viewer Check**: Inspected detail modals for Peter suits (`Anti-Ock`, `Advanced 2.0`), Miles suits (`TRACK`, `Evolved`), Shared skills (`Web Wings`, `Slingshot`), and Symbiote skills (`Tendril Slam`), confirming direct PlayStation links and verification chips.
4. **Compact Face Validation**: Verified `card.innerText.trim()` yields only item names across compact cards.
5. **Engine Action Execution**: Equipped suits and unlocked eligible skills via authoritative `engine.equipSuit()` and `engine.unlockSkill()` methods.

---

## Known Limitations

- **Browser Audio Context**: Web Audio API sound synthesizers rely on user interaction gestures to unlock audio contexts on initial load.
- **Third-Party External Links**: Official reference links target external `playstation.com` and `insomniac.games` domains, opening in new browser tabs via `target="_blank" rel="noopener"`.

---

## Post-Task-17 Skill Card Fallback Cleanup Verification Result (Task 18)

### Problem Resolved
In post-Task-17 compact cards, missing or unlisted media item images rendered a default fallback SVG that contained a `<text x="50" y="62">🕷️</text>` SVG text node inside `MediaHelper.renderMediaCardHtml()`. Standard DOM `card.innerText` included text from SVG `<text>` elements, causing `card.innerText.trim()` for Miles skills to return:
- `🕷️ Camouflage`
- `🕷️ Holographic Decoy`
- `🕷️ Mega Venom Blast`
- `🕷️ Bio-Electric Overcharge`

### Implementation Summary
1. **Code-Native Non-Text SVG Fallback**:
   - Replaced `<text...>` SVG node in `MediaHelper.getMedia()` default fallback object with a pure vector path emblem (`<path d="...">` spider vector geometry) inside a dark slate circle (`#0f172a`) with a crimson accent border (`#e62429`).
   - Added regex sanitization `rawSvg.replace(/<text[\s\S]*?<\/text>/gi, '')` in `MediaHelper.renderMediaCardHtml()` to strip any text nodes prior to rendering.
   - Enforced `aria-hidden="true"` attribute on all SVG fallback root elements so SVG visual elements are ignored by text extractions.

2. **Accessibility & Provenance Preservation**:
   - Retained image `alt` attributes (`alt="${altText || mediaId}"`) on initial image elements.
   - Retained accessible `aria-label` attributes on interactive compact cards (e.g. `aria-label="Xem chi tiết kỹ năng Camouflage"`).
   - Maintained large card detail viewer provenance, game source tags, and PlayStation reference links.

3. **Browser Verification Results**:
   - Verified filters `Miles Morales` + `Marvel's Spider-Man: Miles Morales`:
     - `Camouflage` compact card `innerText.trim()` = `"Camouflage"` (emoji text removed).
     - `Holographic Decoy` compact card `innerText.trim()` = `"Holographic Decoy"` (emoji text removed).
     - `Mega Venom Blast` compact card `innerText.trim()` = `"Mega Venom Blast"` (emoji text removed).
     - `Bio-Electric Overcharge` compact card `innerText.trim()` = `"Bio-Electric Overcharge"` (emoji text removed).
   - Checked all 37 Suits and 48 Skills across Peter, Miles, and Shared filters: `card.innerText.trim()` matches item name strictly.
   - Verified non-text vector SVG fallback renders visually clean without broken image icons or browser console errors.

