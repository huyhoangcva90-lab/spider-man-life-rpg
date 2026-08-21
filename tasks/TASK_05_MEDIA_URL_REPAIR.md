# TASK

Repair and Complete Character Artwork Integration

# OBJECTIVE

The Task 04 galleries and counts are working, but the current invented URLs such as `https://cards.snap.fan/images/render/Tombstone.webp` fail at runtime and fall back to SVG. Repair the media catalog so every villain, ally, and Spider-Verse variant displays a real sourced character image wherever a reliable public source exists. The user explicitly asked for Marvel Snap artwork for all characters.

# VERIFIED EVIDENCE

Browser QA on `http://127.0.0.1:4175/` showed:

- 30 villain cards render and the app has no console errors.
- The 15 newly added villain `<img>` URLs all had `naturalWidth === 0`; after scrolling/lazy loading they were replaced by fallbacks.
- A valid Snap Fan page exposes hashed CDN assets. Example:
  - Page: `https://snap.fan/cards/DoctorOctopus/`
  - Valid base art observed: `https://game-assets.snap.fan/card_variant_images/DoctorOctopus-c6776e01041071036c336b0dbb45104f69297ca78c9d7696a1b4326e51474ea4.webp?width=500&quality=80`
- Therefore do not synthesize or guess `cards.snap.fan/images/render/...` paths. Resolve actual image URLs from page DOM/network/metadata and verify them.

# REQUIREMENTS

1. Use browser/web tools to inspect the authoritative Snap Fan card pages and extract actual current `https://game-assets.snap.fan/...` image URLs.
2. Update `data/media.js` only with URLs that you directly verified load as images (HTTP success and non-zero intrinsic dimensions in browser).
3. Cover all 30 villains, 24 allies, and 18 Spider-Verse variants. Reuse one media entry when the same character appears in multiple collections.
4. Prefer base Marvel Snap card art (`card_variant_images`) rather than booster icons or tiny avatars.
5. Some requested people may not have a Marvel Snap card (for example civilians or game-only characters). For those, use a stable official Marvel/PlayStation promotional image or an attributable public reference image. If none is reliable, retain the original code-native fallback and record the exact exception in `docs/ASSET_CREDITS.md`; never fabricate a Snap card.
6. All 30 villain cards must use media image rendering, including the original 15 that currently still show inline SVG. SVG remains only the error fallback.
7. All 24 ally cards and all 18 variant cards must use the same centralized media renderer and real image-first behavior.
8. Keep `sourceUrl`, `sourceName`, and fallback for every entry. `sourceUrl` should link to the human-readable card/source page, not only the CDN binary.
9. Preserve lazy loading, fixed aspect ratio, meaningful alt text, CSP-free vanilla implementation, and graceful fallback.
10. Do not download/rip game files or copy assets from `spideytracker.com`.
11. Do not edit root `app.js`. Preserve all progression/map/sound behavior.
12. Do not use shell/run-command tools; use file and browser tools.

# ACCEPTANCE CRITERIA

- Browser QA scrolls through Villains, Allies, and Spider-Verse/Collection so lazy images actually enter the viewport.
- At least 90% of the 72 requested character entries display a real image with `complete === true` and `naturalWidth > 0`; every remaining fallback is explicitly documented by character and reason.
- Zero invented `cards.snap.fan/images/render/` URLs remain.
- All 30 villains are image-first, not hard-coded SVG-first.
- No broken-image icons and no console errors.
- Search/filter/equip/select/detail/map/sound behavior remains working.
- Update `docs/IMPLEMENTATION_NOTES_TASK_04.md` with final real-image coverage counts and QA evidence.

# TEST

Use the browser, not assumptions:

1. Load the local app and open each of Villains, Allies, and Spider-Verse variants.
2. Scroll the complete gallery to trigger lazy images.
3. Count successful real images (`img.complete && img.naturalWidth > 0`) and fallback nodes per gallery.
4. Open at least three detail modals per gallery and verify artwork.
5. Record final coverage as `successful / total` for each gallery.
6. Confirm no console errors and no layout overflow.

