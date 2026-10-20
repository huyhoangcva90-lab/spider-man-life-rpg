# Game system pass — 20/10/2026

## Local references actually inspected

- MARVEL Cosmic Invasion in the user-provided game folder: decompressed menu configuration for HeroLab, MoveList, CharacterSelectPanel and PlayerPanel, and read the Spiderman character configuration. The menu data identifies character selection, HeroName/HeroLevel/Description, upgrades, move-list selection, confirmation and separate HP/Focus panels. This is a structural reference; the binary menus were not rendered in the running game.
- Clash Royale user-provided APK archive: reused the previously decoded loadout.toml and prior deck-builder inspection. Spider does not inherit its eight-card limit, arenas or progression gates.
- Hero overview uses an existing Selectscreen frame from the already-extracted Cosmic Spiderman atlas when no suit is equipped. It is clearly labelled as a source sprite, not an equipped suit. No new commercial game files were added.

## Implemented flow

1. Hero opens a character overview with existing LV/XP/HP/Energy, then shortcuts to equipped suit, skill build, map and badges.
2. Skills show the real equipped build before the collection. Every group comes from an existing Skill Slot relation; one relation may hold multiple moves. Missing catalog records stay visible as unavailable records instead of silently disappearing. The live selected skill data can fill the build while the catalog loads.
3. Selecting a build card inspects that move, resets incompatible search/category filters and opens its description. Inspection does not mutate Notion. Explicit equip/remove retains existing relation-only writes.
4. Battle distinguishes the enemy being inspected from the target in a recorded attack. Resolved playback uses the log target; pending logs do not animate. Zero or unknown direct damage does not add a hit flash. Missing log targets do not fall back to the inspected enemy.
5. Clicking the mission title opens its Notion plan. Existing wave text and relation fields are supported. Empty fields do not create blank waves; unresolved relation names send the user to Notion instead of showing raw IDs. A warning identifies a Hero enemy group that differs from the selected mission. The web does not silently replace either selection.
6. Passive/Modifier/Formula/Keystone skills cannot become attack previews. Active/Ultimate actions and passive descriptions stay in separate rows. Skill and mission details support closing with Escape and restore a useful focus target.
7. Details float over the arena without pushing the outer frame. Short arenas scale enemy sprites to avoid cutting their heads off. Hero spacing is scoped to Hero; standalone Finance files and styling are unchanged.

## Data still needed from Notion

- Confirm which mission and Bosses & Minion relations belong to the same encounter; the current display reports their mismatch rather than deciding for the user.
- Populate actual mission wave relations if waves are desired; no current-wave state is inferred from Combat Turn.
- Fill missing skill Energy Cost, Cooldown or Description where appropriate. A dash means not supplied, not free or ready.
- Damage, reward, heal, unlock, phase advancement and attacks remain owned by the existing Notion setup.

## Verification

- Desktop and 390 × 844 browser checks: skill build inspection, passive description, Hero overview and mission dialog. No live Notion equip or attack performed.
- Tests cover real slot ordering, missing selected records, old text/new relation wave fields, mismatched enemies, pending logs, recorded target versus inspected target, and zero damage.
- This game pass does not close unrelated Field privacy, Gym and Todo audit findings in UX_GAME_CHECKLIST.md.
