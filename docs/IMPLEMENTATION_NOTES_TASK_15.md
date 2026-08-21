# TASK 15 IMPLEMENTATION NOTES: Portrait-First Spider Archive & Sound System Deepening

## Executive Summary

Task 15 reshapes the Spider Archive into a portrait-first visual experience centered around high-impact character artwork and names. All cost/power/stat numbers have been removed from compact gallery card faces across all collections. Every card now opens into a cinematic **Large Card Viewer** modal with cycling controls, keyboard navigation, focus trap management, artwork provenance credits, and interactive action buttons. Furthermore, Spider-People (36 entries) and Allies (26 entries) are now strictly separated into dedicated collections, Suits are expanded to 30 entries, Skills are expanded to 44 entries, and the Web Audio sound system has been deepened with 12 new Spider-inspired synthesized audio cues.

---

## 1. Gallery Reclassification & Content Expansion Summary

| Collection | Old Count | New Count | Composition & Classification Rules |
| :--- | :---: | :---: | :--- |
| **Spider-People / Spider-Verse** | 18 | **36** | **Strict Spider Identities Only**: Peter Parker, Miles Morales, Ghost-Spider, Spider-Man 2099, Noir, Spider-Punk, Peni/SP//dr, Pavitr Prabhakar, Spider-Ham, Ben Reilly, Kaine, Superior, Silk, Spider-Woman, Mayday, Annie May, Spider-Man 2211, Unlimited, Spider-Byte, Sun-Spider, Web-Weaver, Night-Spider, Araña, Julia Carpenter, Madame Web, Spiderling, Spider-Armor Mk I, Cyborg Spider-Man, Spider-Rex, Supaidāman, Web-Slinger, Spider-Boy, Last Stand, Cosmic Spider-Man, Zombie Spider-Man, Spider-Goblin. |
| **Spider-Allies & Companions** | 24 | **26** | **Pure Non-Spider Allies Only**: Mary Jane Watson, Aunt May, Uncle Ben, Harry Osborn, Ganke Lee, Yuri Watanabe, Black Cat, Silver Sable, Wraith, Daredevil, Human Torch, Wolverine, Deadpool, Doctor Strange, Iron Man, Captain America, Luke Cage, Jessica Jones, Cloak, Dagger, Ned Leeds, Dr. Otto Octavius (reformed), Agent Venom, Ezekiel Sims, Robbie Robertson, Moon Knight. |
| **Suits Studio** | 18 | **30** | **30 Spider-Man Suits**: Classic, Advanced 2.0, Symbiote, Anti-Ock, Velocity, Iron Spider, Stealth (Big Time), Punk, Noir, 2099, Spider-Armor Mk IV, Superior, Integrated, Homemade, Dark Suit, Bodega Cat, Miles 2020, Miles Purple Reign, Miles End, Spider-Verse Animated, Secret War, Fear Itself, Negative, Electrically Insulated, Bombastic Bag-Man, Spider-Clan, Cyborg, Kumo, Wrestler, Undies. |
| **Skill Tree & Moves** | 28 | **44** | **44 Skills across 5 Branches**: Spider Abilities (9), Web Combat (9), Tech & Stealth (9), Bio-Electric Venom (9), Symbiote Powers (8). |
| **Villains Codex** | 30 | **30** | **30 Super-Villains**: Doc Ock, Green Goblin, Venom, Carnage, Mysterio, Kraven, Lizard, Sandman, Electro, Vulture, Rhino, Scorpion, Shocker, Kingpin, Mister Negative, Tombstone, Hammerhead, Taskmaster, Prowler, Tinkerer, Morbius, Chameleon, Hobgoblin, Jackal, Hydro-Man, Molten Man, Scream, Knull, Morlun, The Spot. |
| **Insomniac Gadgets** | 16 | **16** | **16 Gadgets**: Web-Shooters, Impact Web, Web Bomb, Spider-Drone, Electric Web, Concussive Blast, Trip Mine, Matrix Web, Ricochet Web, Sonic Burst, Gravity Well, Holo-Drone, Web-Whip, Upshot, Suspension Matrix, Micro-Cable. |
| **Total Archive Entries** | **134** | **166** | **100% Media Coverage across 166 entries**. |

---

## 2. Portrait-First Visual Design & Clean Compact Card Face

- **No Stat Number Clutter**: All cost numbers, power stats, HP, and armor values have been removed from compact gallery card faces.
- **Visual Structure**:
  1. Dominant portrait media frame (3:4 ratio) with smooth image scale on hover.
  2. Holographic edge accent (`border: 1px solid rgba(255, 255, 255, 0.12); hover: var(--spider-blue)`).
  3. Single subtle status chip in top-right corner (`chip-equipped` / `chip-category`).
  4. Readable bottom gradient nameplate with high-contrast character/item name and subtitle.

---

## 3. Large Card Viewer Lightbox & Navigation Controls

- **Cinematic Detail View**: Clicking/tapping any compact card face opens the **Large Card Viewer** modal.
- **Controls & Accessibility**:
  - `◄ PREV` and `NEXT ►` header buttons cycle through the active search/filtered result set seamlessly.
  - Keyboard navigation: `ArrowLeft` for previous card, `ArrowRight` for next card, `Escape` to close.
  - Focus trap management: Focus is captured inside the modal while open and returned to the triggering element on close.
  - Mobile Sheet Mode (`@media (max-width: 580px)`): Converts into a responsive mobile sheet with sticky top controls.
- **Content Display**:
  - High-res portrait artwork frame.
  - Full title, universe badge, publisher chip, and Vietnamese description.
  - Passive buff description & active move pill.
  - Artwork provenance block with generator metadata (`promptFamily`, `creationTool`, `disclaimer`).
  - Contextual action buttons (SET PRIMARY IDENTITY, EQUIP SUIT, EQUIP ALLY, CHALLENGE BOSS, UNLOCK SKILL).

---

## 4. Web Audio Synthesized Sound System Deepening

12 new explicit Web Audio sound cues added to the `SoundFx` class in `js/app.js`:

1. `webThwipLight()`: Rapid web thwip (1200Hz to 300Hz sweep).
2. `webThwipHeavy()`: Heavy web impact (800Hz to 90Hz double oscillator).
3. `webSwingLaunch()`: Ascending swoop launch (200Hz to 950Hz sweep).
4. `webSwingRelease()`: Descending release whistle (850Hz to 250Hz sweep).
5. `spiderSensePulse()`: Dual-tone high electric ping (1760Hz & 2200Hz pulse).
6. `suitTechOpen()`: Ascending servo shimmer (4-frequency arpeggio).
7. `suitEquipLock()`: Metallic latch click + power-up hum (480Hz & 180Hz square/triangle).
8. `venomCharge()`: Bio-electric charge crackle (4-step frequency wobble).
9. `venomImpact()`: Thunderous bio-electric burst (600Hz sawtooth + 120Hz sub-bass).
10. `symbioteTendril()`: Organic squelch pitch bend (450Hz to 110Hz triangle sweep).
11. `cardExpand()`: Resonant lightbox opening swell (250Hz to 750Hz sine sweep).
12. `cardCollapse()`: Smooth lightbox closing drop (750Hz to 200Hz sine sweep).

---

## 5. File Inventory & System Integration

- `data/spider-people.js` (Created): Defined `SPIDER_PEOPLE_DATA` (36 entries).
- `data/allies.js` (Replaced): Cleaned `ALLIES_DATA` (26 non-Spider entries).
- `data/suits.js` (Replaced): Expanded `SUITS_DATA` (30 entries).
- `data/skills.js` (Replaced): Expanded `SKILLS_DATA` (44 entries).
- `data/media.js` (Modified): Added media catalog entries for all 166 items and enhanced `MediaHelper` multi-tier fallback pipeline.
- `js/storage.js` (Modified): Updated save file merging to automatically acquire new seed items into existing user save states.
- `index.html` (Modified): Updated view titles, collection tabs, script tag imports, and Large Card Viewer modal shell.
- `styles.css` (Modified): Added portrait-first card face styling, holographic edge accents, and Large Card Viewer lightbox sheet CSS.
- `js/app.js` (Modified): Added 12 sound cues, Large Card Viewer controller with keyboard navigation & focus trap, and updated grid renderers for all collections.
- `docs/ASSET_CREDITS.md` (Modified): Documented expanded asset counts and generated fan artwork provenance pipeline.
- `docs/IMPLEMENTATION_NOTES_TASK_15.md` (Created): Full architectural notes for Task 15.

---

## 6. Zero Exploitation & Integrity Verification

- **No Stat Reset**: Existing save snapshot structure (`v2_spider_rpg_state_v2`) is fully preserved; seed item merging preserves all user levels, unlocked skills, equipped suits, and gold balances.
- **No Free Reward Exploitation**: Browsing galleries, expanding card view, toggling filters, and cycling Previous/Next cards **never** grant XP, Gold, loot items, or combat progression.
