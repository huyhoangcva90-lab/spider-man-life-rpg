# TASK

Official Sony / Marvel / PlayStation Media Coverage Pass

# OBJECTIVE

The user explicitly wants the application to prioritize recognizable Sony, Marvel, PlayStation, and Insomniac promotional imagery instead of conservative code-native fallbacks. Complete the media coverage for characters, suits, gadgets, skills, and moves while preserving the working application.

# USER DIRECTION

Use publicly accessible images from official Sony Pictures, Marvel, PlayStation, and Insomniac pages/media, plus Marvel Snap card art already integrated. The user accepts use of this copyrighted promotional material in this personal fan prototype.

Do not bypass access controls, extract packaged game files, defeat DRM, or copy code/audio from third-party sites. Public promotional/editorial images are in scope.

# CURRENT STATE

- Task 04-06 are implemented.
- Runtime content: 30 villains, 24 allies, 18 Spider-Verse variants, 18 suits, 16 gadgets, 28 skills/moves, City Map, synthesized sound.
- Verified Marvel Snap CDN art currently loads for 24/30 villains and 20/24 allies; all 18 variant cards display images, though some reuse character art.
- Remaining characters use code-native fallback because they lack a suitable Snap card.
- Do not edit root `app.js`; active controller is `js/app.js`.

# REQUIREMENTS

## 1. Replace remaining character fallbacks

1. Identify every villain, ally, and Spider-Verse entry that still renders fallback SVG/emoji.
2. Find a recognizable public image in this priority order:
   - official Marvel character page/media;
   - official PlayStation/Insomniac Spider-Man game page, trailer thumbnail, blog, or press image;
   - official Sony Pictures Spider-Verse/Spider-Man page, trailer thumbnail, or press image;
   - established Marvel/PlayStation wiki editorial image only if no official public image is available.
3. Use actual direct image URLs verified to load with non-zero intrinsic dimensions. Do not guess URL paths.
4. Preserve `sourceUrl`, `sourceName`, alt text, and SVG fallback in `data/media.js`.

## 2. Suits imagery

1. All 18 suit cards must display recognizable suit artwork/screenshot, not emoji-only cards.
2. Prefer official PlayStation Blog or Insomniac promotional screenshots from Marvel's Spider-Man (2018), Miles Morales, and Spider-Man 2.
3. Match each image to the correct named suit. Do not use one generic image for many unrelated suits unless no correct public image exists.
4. Keep a consistent portrait/card crop; use `object-position` metadata when necessary so the suit remains visible.

## 3. Gadgets imagery

1. All 16 gadget cards must display a relevant gadget/action screenshot or official UI/promotional image.
2. Match Web Shooter, Impact Web, Web Bomb, Spider Drone, Electric Web, Suspension Matrix, Trip Mine, Concussive Blast, Gravity Well, Remote Mine, Holo-Drone, Web Grabber, Ricochet Web, Sonic Burst, Upshot, and Spider-Tracer accurately.
3. If an exact isolated gadget image is unavailable, use an official gameplay screenshot showing that gadget in action and label its game source.

## 4. Skills and moves imagery

1. All 28 skills/moves must be image-first.
2. Use official screenshots/trailer stills that visibly correspond to the move family: traversal, web combat, Venom powers, camouflage, symbiote powers, parry/dodge, finishers, Web Wings, slingshot, loop-de-loop, and related skills.
3. Shared imagery is allowed only inside the same move family, and cards must still identify the exact move through title/chip/copy.

## 5. Media renderer and UI

1. Extend the centralized media catalog rather than embedding URLs throughout render functions.
2. Every requested card must call the same image-first renderer.
3. Preserve lazy loading, stable aspect ratios, error fallback, detail modal, search/filter, keyboard access, and responsive layout.
4. Official cinematic 16:9 images should use a landscape media treatment where appropriate for skills/gadgets; character/suit cards should remain portrait-forward. Do not distort images.
5. Add a compact visible source chip such as `MARVEL SNAP`, `PLAYSTATION`, `SONY PICTURES`, or `MARVEL` in detail views, not over every gallery image if it harms readability.

## 6. Provenance

1. Update `docs/ASSET_CREDITS.md` with official source pages grouped by publisher/game.
2. Record exact coverage counts for characters, suits, gadgets, and skills.
3. Do not claim an image is official if it comes from a wiki/editorial source; label it accurately.

# ACCEPTANCE CRITERIA

- 30/30 villains display real recognizable images after lazy loading.
- 24/24 allies display real recognizable images after lazy loading.
- 18/18 Spider-Verse variants display real recognizable images.
- 18/18 suits, 16/16 gadgets, and 28/28 skills/moves display relevant real images.
- All direct image URLs were verified in browser; no broken images, no invented URLs, and no console errors.
- Image crops remain readable on desktop and narrow screens.
- Existing map, sound persistence, progression, equip, search/filter, and navigation behavior still work.
- No durable rewards are created by media/gallery interactions.
- Update `docs/IMPLEMENTATION_NOTES_TASK_04.md` with final coverage and QA evidence.

# TEST

Use browser tools, not assumptions:

1. Reload the local app after edits.
2. Visit Villains, Allies, Spider-Verse, Suits, Gadgets, and Skills.
3. Scroll each complete gallery to activate lazy loading.
4. Count every requested card and verify its rendered `<img>` has `complete === true` and `naturalWidth > 0`.
5. Open representative detail views for each source family.
6. Test filters/search and all 14 navigation screens.
7. Verify SFX/BGM settings still persist across reload.
8. Confirm no console errors and no horizontal overflow.

# WORKING RULE

Work autonomously with file and browser tools. Do not use shell/run-command tools because headless permission cannot be granted.

