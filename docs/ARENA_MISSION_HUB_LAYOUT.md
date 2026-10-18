# Arena Mission Hub — layout only

## Sources reviewed

- Owner attachment: “YÊU CẦU THIẾT KẾ & TÁI CẤU TRÚC GIAO DIỆN UI/UX”, supplied 18 October 2026.
- Owner's latest clarification takes priority over the attachment's mobile frame removal:
  preserve the existing tracker frame, four corner animations, artwork, fonts and colors.
- Antigravity working copy: added `css/mobile-game-ui.css` and one stylesheet link in primary `index.html`.
  Original CSS SHA256: `EE4BDD54A4C96CB29068B3D4C1957DF31C525856430D783454B388C7BC865693`.
  Primary working changes are preserved. The deployable worktree adapts the spatial intent;
  broad `!important` overrides and frame removal are not copied over the current production shell.
- Local game: `D:/test/Zenflow-main/Clash+Royale_160402020_APKPure.xapk`.
  Inspected base APK and install-time assets archive; decoded Supercell LZMA tables:
  `assets/csv_client/battle_page_button_layout.csv`, `health_bars.csv`, `ability_button.toml`.
  Confirmed `assets/sc/ui.sc`, battle/main-screen and ability-button resources.
  Binary scene textures were not rendered as screenshots; no claim of a pixel-identical game screen.

## Applied reference principles

The battle-page table assigns sides, ordering and maximum counts to secondary buttons.
Health-bar definitions keep own/enemy HP and shield variants separate.
Ability-button states distinguish available, cooldown, absent and disabled cases.
Use that hierarchy to keep persistent resources, the active screen and primary navigation distinct.
No Clash shop, clan, chest, currency, mechanics, fonts or artwork are imported into Spider.

## Layout checklist

- [x] Keep the existing slice frame and animated corner characters on desktop and mobile.
- [x] One HUD outside the battle screen, persistent across Hero/Quests/Habits/Field.
- [x] Avatar and LV open Hero Profile as keyboard-accessible buttons.
- [x] Preserve existing resource, combat, panel and navigation IDs.
- [x] Five primary destinations: Quests / Hero / Battle / Life 66 / Field.
- [x] Place Map stays accessible through Field > Places / Place Map and the corner menu.
- [x] Primary pages replace the viewport below HUD, without a modal scrim or close-to-Battle step.
- [x] Hide the covered battle from focus and accessibility while a primary page is open.
- [x] Ordered Hero tabs: Profile / Suits / Skills / Maps / Badges (Notion mode).
- [x] Quests opens Today; Mission / Overdue / Goals remain explicit destinations.
- [x] Horizontal subtabs with keyboard arrows, Home/End and labelled tab panels.
- [x] Collapsible new-task form with original input IDs and submission handler.
- [x] Selected skill row shows up to five records together; longer selections scroll.
      No skill is removed or assigned a fabricated slot/cost.
- [x] Turn information shares the mission strip, leaving the character stage unobstructed.
- [x] Preserve separate immersive Gambit tools and the focused `/pk` embed.
- [x] Unknown XP is not replaced by a default reward; real zero remains zero.

## Data boundary

No combat, healing, reward, loadout or mission mutation was added. The public Notion
projection remains the authority for game state. Publicly unavailable private DBs
remain unavailable; no private task/routine snapshots are published as part of this UI work.
Unrepresented Notion concepts are not turned into mock Roster/Gadget screens.

## Verification

- Browser: desktop 1280×720; portrait 390×844 and 360×667.
- Portrait Hero: HUD ends at y146, panel begins y154; panel ends y721,
  dock begins y725. No document horizontal overflow at width390.
- Arrow-key subtabs, avatar → Profile, Field → separate app → return verified.
- Map: HUD and game dock hidden; original frame and map stay visible.
- PK: original frame and battle visible; primary navigation hidden; HUD navigation disabled.
- All existing HTML IDs preserved, no duplicates.
- 13 existing/related Notion, session, Routine, Karen and map tests pass;
  all12 Gambit route/cache integration checks pass.
- Primary Antigravity files still have their original hash and uncommitted state.
