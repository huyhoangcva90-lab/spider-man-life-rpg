# TASK 29 — V5 TRUE GAME REBUILD FROM SCRATCH

Work only in:
`C:\Users\huyklgl\Documents\antigravity\mysterious-kepler`

Create a completely new application under `app-v5/`. Do not modify or delete `app-v4/` or legacy root files.

## Product verdict

V4 is rejected because it is still a productivity dashboard wearing a game skin. V5 must feel like launching and playing a life RPG. The first screen must be a playable city/world scene, not cards, charts, stat panels, or a sidebar dashboard.

## Player and product

- Player: Vietnamese male, 29, freelancer.
- Fantasy: an original urban web-operative protecting a living city by completing real-life missions.
- Real data: reuse the truthful read-only Notion snapshot and normalization seam from V4. Never fabricate missing Notion values or relationships.
- Language: primary game copy in Vietnamese; concise English tactical labels may appear as secondary flavor.

## Required art direction

Design name: **NEON NOIR LIVING CITY**.

Palette:
- Midnight Asphalt `#05070D`
- Rain Glass `#111827`
- Signal Cyan `#22D3EE`
- Alert Crimson `#F43F5E`
- Sodium Amber `#F5B942`
- Paper White `#E8EDF5`

Typography:
- cinematic condensed display for mission/boss titles;
- highly readable sans-serif for Vietnamese;
- monospaced utility face only for telemetry.

Signature element: a full-viewport interactive **Living City Map** whose districts, patrol nodes, threat lines, weather, and mission beacons respond to player state. Spend visual boldness here. Everything else should support it.

Do not use a persistent desktop sidebar. Do not make the home screen a card grid. Avoid generic glass dashboard cards, giant KPI numbers, fake charts, excessive pills, and admin-table layouts.

## Core experience

### 1. Launch / World

- Full-screen animated city scene built with performant HTML/CSS/SVG/canvas; no heavy framework required.
- Original hero key art can reuse `app-v4/assets/characters/web-operative-v1.png`.
- Clear foreground character presence, skyline depth, rain/atmosphere, patrol path, threat territory and real Notion mission beacons.
- Camera-like pan/zoom or district focus interaction.
- One primary prompt: choose a live mission beacon and enter briefing.
- Compact diegetic HUD: health/focus, level/XP, boss threat, time/weather. It should feel like an in-game HUD, not a top navigation bar.

### 2. Mission briefing and play loop

- Selecting a beacon opens an in-world mission briefing sheet/drawer.
- Show real mission title, source, due date, priority, focus duration, predicted rewards and exact Notion record link.
- `Bắt đầu nhiệm vụ` enters focus mode with a working countdown, pause/resume, abandon confirmation and reduced-distraction layout.
- `Hoàn thành nhiệm vụ` awards XP/gold/attributes and damages the active threat exactly once.
- Completion triggers a short orchestrated sequence: web strike, threat damage, reward tally, city node state change. Respect `prefers-reduced-motion`.
- Completion must persist across reload and never duplicate rewards.

### 3. Game systems

- World: city map and patrol.
- Missions: tactical mission board using spatial/list hybrid, not a CRUD table.
- Operative: character portrait, equipment slots, attributes, status, identity habits.
- Hideout: suits, skills and gadgets represented as collectible equipment with meaningful modifiers.
- Chronicle: story arcs/Goals, Projects and completed mission history.
- Every stat, suit, gadget, skill and habit shown must explain its mechanical effect.
- Missing Project/Area/Goal stays `Chưa phân loại`; missing daily/habit data stays honest.

### 4. Navigation

- Desktop: minimal command rail or radial/corner controls over the world, hidden until interaction where practical.
- Mobile: thumb-friendly bottom game dock and bottom sheets.
- The world remains visually present behind overlays when switching systems, so the player never feels they left the game.

### 5. Responsive/mobile

- First-class at 360x800 and 390x844.
- Minimum 44px touch targets, safe-area support, no horizontal overflow.
- On mobile, mission briefing/focus/completion are full-height bottom sheets.
- Maintain cinematic composition and readable hero/mission emphasis.

## Architecture

- Vanilla browser-native ES modules are acceptable and preferred for compatibility with current repo.
- Reuse only truthful data/integration logic from V4; rewrite the presentation and app shell from scratch.
- Organize `app-v5/` into clear `css/`, `js/core`, `js/game`, `js/ui`, `js/integrations/notion`, `data`, and `assets` boundaries.
- Static frontend must label the source as `Notion snapshot`, not live sync.
- No private token in frontend.

## Quality gates

1. Run syntax checks for every JS file.
2. Serve `app-v5/` locally and test initial load, every game route/system, mission start/pause/resume/complete, reload idempotency and direct Notion links.
3. Test desktop 1440x1000, mobile 390x844 and 360x800.
4. Inspect screenshots and critique the design three times. Fix defects after each critique.
5. Console must have zero uncaught errors.
6. No visible mojibake.

## Acceptance test

Within five seconds of opening V5, a person should describe it as a city-based RPG game, not a productivity dashboard. The dominant visual is the playable living city and character fantasy. Real Notion tasks power missions without compromising data truth.

At the end, report:
- files created/changed;
- game loop implemented;
- QA performed and defects corrected;
- exact local URL used;
- any limitation remaining.

