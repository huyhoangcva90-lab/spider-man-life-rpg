# TASK

Spidey Tracker Reference UX/UI, Sound, and City Map Polish

# OBJECTIVE

Use `https://spideytracker.com/` (redirects to `spideytracker.net`) as a UX/UI interaction reference and upgrade the current City Map into a polished in-universe Spider Ops tracking console. Preserve the existing Life RPG architecture, 134 working media images, progression, and 14-screen navigation.

# REFERENCE AUDIT

The reference site was inspected directly. Useful patterns:

- startup/boot console with short system-status lines;
- a framed tracker-device viewport rather than a generic dashboard panel;
- explicit `SOUND ON / SOUND OFF` choice before entering;
- map-first experience with typed marker legend;
- confirmed/rumored/event categories encoded with color and shape;
- compact side controls, radar/minimap motif, center-map control;
- activity log and a horizontally moving status/message ticker;
- pixel/CRT scanline texture, restrained boot animation, map loading state;
- contextual panels opened from map markers;
- always-available mute control.

Take the interaction grammar and information architecture. Do not copy Sony source code, logos, exact pixel artwork, map data, or audio files. Build an original Spider Life/Oscorp tracker implementation.

# DESIGN DIRECTION

## Subject and job

- Subject: Peter Parker's personal Life RPG patrol terminal.
- Audience: the owner using real-life tasks as missions.
- Single job: let the user scan the city, understand current threats/opportunities, and jump to the correct existing workflow without creating fake rewards.

## Token plan

- Void Navy `#030712`: outer shell/background.
- Oscorp Cyan `#00E5FF`: scanner/active information.
- Spider Red `#E62429`: threat/action emphasis.
- Signal Amber `#FFB700`: rumored/warning state.
- Intel Green `#22C55E`: confirmed/completed state.
- Frost `#E6F7FF`: readable terminal text.
- Keep Bebas Neue for display, Inter for body, JetBrains Mono for boot/status/coordinates.

## Layout concept

Desktop:

`[ side nav ][ SPIDER OPS TRACKER DEVICE: header / map viewport / intel panel / ticker ]`

Mobile:

`[ compact header ][ tracker controls ][ map ][ selected-node sheet ][ ticker ]`

## Signature

An original “web-frequency scanner” where a cyan radar sweep briefly reveals web-line connections between active mission nodes. This is the one visual flourish; keep surrounding chrome disciplined.

# REQUIREMENTS

## 1. Tracker shell and boot/calibration

1. Recompose `#view-map` into a distinctive device/terminal shell with:
   - top tracker ID/status strip;
   - primary map viewport;
   - marker/category controls;
   - contextual intel panel;
   - bottom status ticker;
   - compact sound control.
2. Add a short first-visit calibration overlay for the Map screen:
   - 4-6 boot/status lines with a skip option;
   - asks `SOUND ON` or `SOUND OFF` before entering tracker mode;
   - stores a lightweight `trackerOnboarded` flag and respects existing `soundSettings`;
   - must never autoplay audio before the user's sound choice/click;
   - add a `REPLAY CALIBRATION` option in the map Help/Settings control.
3. Existing users with map state should not be trapped; overlay is dismissible and keyboard accessible.

## 2. Map interaction model

1. Preserve the original code-native NYC SVG, 7 districts, and 8 mission nodes.
2. Refine node categories into user-facing tracker language while preserving routing:
   - confirmed mission;
   - rumored threat;
   - active event/project;
   - ally intel;
   - completed;
   - locked.
3. Color must be redundant with shape/icon/text label.
4. Add:
   - visible marker legend;
   - filter drawer/chips;
   - center-map button;
   - selected node coordinates/district/status/source;
   - activity log showing recent map selections/navigation only;
   - compact radar/minimap visualization derived from current nodes;
   - empty result guidance when filters/search hide every node.
5. Marker selection gets one orchestrated scan reveal: radar pass + web connection lines + node ping. Do not scatter animation across every element.
6. `prefers-reduced-motion` disables sweep, scanline movement, ticker movement, and animated web connections while keeping state readable.
7. Map selection/filter/onboarding never mints XP, Gold, loot, HP damage, or completion.

## 3. Sound design

1. Use the existing synthesized Web Audio engine only; no copied audio from the reference site or games.
2. Add/refine original named cues:
   - tracker boot ticks;
   - calibration confirm;
   - map open/close;
   - filter toggle;
   - node hover/focus tick (throttled, not noisy);
   - node select ping;
   - radar scan pulse;
   - warning/rumored alert;
   - confirmed/success chime;
   - ticker message chirp only on meaningful state change.
3. All cues respect persisted `sfxEnabled`, `musicEnabled`, and master volume.
4. No AudioContext creation/resume on page load. User gesture only.
5. Avoid continuous sound loops on Map; a subtle one-shot pulse is enough.

## 4. UX/accessibility/responsive

1. Every control and marker works with keyboard; use visible focus and accurate ARIA state.
2. Sound choices must say the effect plainly and expose `aria-pressed`/selected state.
3. The ticker must not be the sole place important information appears.
4. At 360px, map and panel stack without horizontal page overflow; filter chips may horizontally scroll inside their own region.
5. Preserve readable card/media performance and do not eagerly load hidden galleries.
6. Repair mojibake only in files/strings touched for this task.

## 5. Preserve existing functionality

- 14 navigation screens.
- 30 villains, 24 allies, 18 variants, 18 suits, 16 gadgets, 28 skills/moves.
- 134/134 runtime images remain successful after lazy load.
- Sound persistence continues to pass reload tests.
- Existing boss/quest/project/ally navigation from map remains intact.
- Root `app.js` remains untouched; active controller is `js/app.js`.

# LIKELY FILES

`index.html`, `styles.css`, `js/app.js`, `js/storage.js`, `data/map.js`, and `docs/IMPLEMENTATION_NOTES_TASK_09.md`. Modify only what is needed.

# ACCEPTANCE CRITERIA

- City Map reads visually and behaviorally as an original in-universe tracker console inspired by the reference patterns.
- First-visit calibration and sound choice work, persist, replay, skip, and remain accessible.
- All 8 markers, filters, search, legend, radar, intel panel, ticker, center map, and routing work.
- No progression reward changes from tracker UI.
- Sound cues obey settings and autoplay policy; SFX/BGM toggles still persist after reload.
- No console errors; all loaded JavaScript parses.
- No horizontal overflow on desktop and 360px.
- All 14 screens and 134 media images remain intact.

# TEST

Use browser tools against the existing local app or start an available local preview without shell commands:

1. Fresh state: open Map, complete/skip calibration with sound on and off.
2. Reload: onboarding and sound choice persist.
3. Replay calibration and exit with keyboard.
4. Exercise every marker category/filter/search/center-map control.
5. Confirm node launch routes to existing screens and header XP/Gold do not change.
6. Verify reduced-motion behavior.
7. Navigate all 14 screens and check console.
8. Scroll all six media galleries and ensure 134/134 images still load.

# WORKING RULE

Work autonomously with file and browser tools. Do not use shell/run-command tools because headless permission cannot be granted.

