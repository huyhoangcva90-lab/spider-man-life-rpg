# TASK 09 IMPLEMENTATION NOTES: SPIDER OPS TRACKER CONSOLE POLISH & SOUND UPGRADE

**Title**: Spidey Tracker Reference UX/UI, Web-Frequency Scanner, First-Visit Calibration, Sound Engine & City Map Polish  
**Status**: Completed & Verified  
**App Version**: `schemaVersion: 2` (V2 Persistence & Engine Architecture intact)

---

## 1. Executive Summary & Deliverables

Task 09 upgrades the City Map (`#view-map`) into a high-fidelity, in-universe **Spider Ops Tracking Console** inspired by the interaction design grammar of `spideytracker.com` (redirects to `spideytracker.net`).

All existing Life RPG architecture, 134/134 working media images, progression rewards, and 14-screen navigation have been strictly preserved.

### Key Deliverables Implemented

1. **Tracker Shell Terminal (#view-map)**:
   - **Top Status Strip**: Features live system status indicator (`● SYS_ONLINE`), terminal branding (`SPIDER OPS TRACKER`), signal frequency (`FREQ: 142.85 MHz`), compact sound mode toggle (`SOUND ON / SOUND OFF`), `⚙️ REPLAY CALIBRATION`, and `🎯 RE-CENTER` controls.
   - **Framed Tracker Viewport**: Embedded device frame with CRT scanline texture overlay, Oscorp radar sweep gradient, live 100x100 canvas minimap radar widget, vector NYC SVG map, web-frequency line scanner layer, and interactive node markers.
   - **Category Controls & Visible Legend**: Filter chips (`ALL TARGETS`, `🔷 CONFIRMED`, `⚠️ RUMORED`, `⭐ PROJECTS`, `🤝 ALLY INTEL`, `🔒 LOCKED`, `✅ COMPLETED`), search input, and visible marker legend bar encoding categories redundant with shape, icon, color, and text.
   - **Contextual Intel Side Panel**: Displays target ID, geographic coordinates (`73.985°W / 40.758°N`), district, signal status, intel source, estimated rewards, deploy button (`🚀 DEPLOY TO [TARGET VIEW] SCREEN`), and a real-time patrol activity log.
   - **Bottom Broadcast Ticker**: Horizontally moving status ticker displaying continuous tactical updates (`[TARGET LOCK]: DOCTOR OCTOPUS ATTACK...`).

2. **First-Visit Calibration & Onboarding Overlay**:
   - Displays a terminal boot console on first Map visit (4 boot/status lines with typing animation).
   - Prompts the user with explicit `[ 🔊 SOUND ON ]` or `[ 🔇 SOUND OFF ]` choice before entering tracker mode.
   - Includes `[ ⏩ SKIP (ESC) ]` option and keyboard accessibility (focus traps, Escape key dismiss).
   - Persists a lightweight `trackerOnboarded` flag inside `state.mapState`.
   - Never autoplays audio before explicit user gesture/click.
   - Includes a `⚙️ REPLAY CALIBRATION` option in the tracker header strip allowing users to replay calibration at any time.

3. **Signature "Web-Frequency Scanner" Visual & Audio Flourish**:
   - Selecting a map marker triggers an orchestrated scan reveal: radar pass + curved cyan web connection SVG lines between active target nodes + node ping.
   - Respects `prefers-reduced-motion`: disables radar sweep rotation, CRT scanline movement, web line dash animation, and ticker movement while maintaining full legibility and interactivity.
   - Map selection, filter switching, and calibration NEVER mint XP, Gold, loot, HP damage, or quest completion.

4. **Synthesized Web Audio Sound Design**:
   - Synthesized Web Audio engine only (`AudioContext` / `OscillatorNode` / `GainNode`); zero external audio files.
   - Named audio cues:
     - `trackerBoot`: rapid multi-tone boot ticks
     - `calibrationConfirm`: ascending harmonic chime
     - `mapOpen`: terminal activation sweep
     - `mapClose`: terminal deactivation sweep
     - `filterToggle`: quick frequency notch blip
     - `nodeHover`: soft throttled tick (max once per 100ms)
     - `nodeSelect`: dual-tone target ping
     - `radarScanPulse`: subtle one-shot sonar pulse (replaces continuous looping sound)
     - `warningAlert`: dual-tone amber warning beep for rumored/boss threats
     - `confirmedChime`: bright green/cyan confirmation chime
     - `tickerChirp`: micro chirp on ticker updates
   - Sound toggles (`sfxEnabled`, `musicEnabled`, master volume) persist across reloads and sync with top strip button state.

5. **Accessibility & Responsive Performance**:
   - Full keyboard navigation (`tabindex="0"`, `role="button"`, `aria-label`, `aria-selected`, `aria-pressed`, Enter/Space activation).
   - Tested responsive behavior at 360px mobile view with zero horizontal page overflow (filter chips scroll horizontally inside container).
   - All 14 navigation screens remain fully functional and all 134 media assets load successfully.

---

## 2. Updated File Inventory

- `index.html`: Recomposed `#view-map` into terminal shell structure with legend, radar canvas, web connection layer, intel panel, ticker, and `#trackerCalibrationModal`.
- `styles.css`: Added design system tokens (`--void-navy: #030712`, `--oscorp-cyan: #00E5FF`, `--spider-red: #E62429`, `--signal-amber: #FFB700`, `--intel-green: #22C55E`, `--frost-text: #E6F7FF`), terminal shell styling, CRT scanline overlay, web connection animation, minimap radar widget, ticker, calibration modal, reduced motion rules, and 360px mobile responsive rules.
- `data/map.js`: Refined map nodes with tracker category types, coordinates, sources, icons, shapes, and descriptions.
- `js/storage.js`: Added `trackerOnboarded: false` default and validation inside `StorageManager`.
- `js/app.js`: Upgraded `SoundFx` class with named sound cues, map open/close pulse, radar canvas minimap drawing, SVG web connections rendering, activity logging, ticker updates, calibration overlay handlers, and sound UI synchronization.
- `docs/IMPLEMENTATION_NOTES_TASK_09.md`: Documented implementation notes and acceptance verification.

---

## 3. Verification & Acceptance Checklist

- [x] **In-Universe Tracker Console**: `#view-map` reads visually and behaviorally as Peter Parker's personal Life RPG patrol terminal.
- [x] **First-Visit Calibration**: Boot lines, sound choice (`SOUND ON` / `SOUND OFF`), skip option, keyboard Escape, and `REPLAY CALIBRATION` work, persist, and respect autoplay policies.
- [x] **Interactive Controls**: All 8 nodes, filter chips, search input, marker legend, radar minimap, intel panel, activity log, ticker, center-map button, and deploy routing work smoothly.
- [x] **No Fake Rewards**: Map selection and filter navigation do not alter character XP, Gold, items, or quest state.
- [x] **Sound Engine Integrity**: Synthesized cues obey settings, persist after reload, and avoid continuous audio loops.
- [x] **Reduced Motion**: Disables scanlines, radar sweep, ticker animation, and web lines when requested.
- [x] **Responsive Layout**: Zero page horizontal overflow at 360px width.
- [x] **System Stability**: All 14 screens and 134/134 media images remain 100% functional without console errors.
