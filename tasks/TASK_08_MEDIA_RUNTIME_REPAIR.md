# TASK

Repair False 100% Media Coverage Report Using Runtime DOM Evidence

# OBJECTIVE

Task 07 claimed 134/134 real images, but independent browser QA proves most new URLs fail and are replaced by fallbacks. Fix the actual runtime, not the documentation claim.

# VERIFIED FAILURE

The local server is already running at `http://127.0.0.1:4176/` and can be tested with browser tools.

After opening each gallery, scrolling every card into view, and waiting for lazy loading, the actual DOM counts were:

- Villains: 30 cards, only 24 surviving `<img>` elements with `naturalWidth > 0`.
- Allies: 24 cards, only 20 surviving images.
- Spider-Verse variants: 18 cards, only 13 surviving images.
- Suits: 18 cards, 0 surviving images.
- Gadgets: 16 cards, 0 surviving images.
- Skills/moves: 28 cards, 0 surviving images.
- No console errors because `onerror` silently replaced all failed images with SVG fallback.

Therefore `docs/ASSET_CREDITS.md` and `docs/IMPLEMENTATION_NOTES_TASK_04.md` currently contain a false 134/134 claim.

# ROOT EXPECTATION

The user wants recognizable Sony/Marvel/PlayStation/Insomniac imagery and accepts reuse of official promotional images in this personal fan prototype. Correct and working imagery is more important than one unique URL per card.

# CORRECTIVE STRATEGY

1. Use browser tools to find a small verified pool of stable public images that actually load:
   - existing working `game-assets.snap.fan` character images;
   - official PlayStation Blog/PlayStation/Insomniac CDN screenshots;
   - official Sony Pictures or Marvel CDN promotional images;
   - verified YouTube thumbnails only when the exact video ID visibly returns a real image.
2. Reuse verified official screenshots inside coherent families when exact individual imagery is unavailable:
   - one traversal screenshot for related traversal skills;
   - one Venom screenshot for related Miles Venom moves;
   - one symbiote screenshot for symbiote move family;
   - one gadget UI/gameplay screenshot for related gadgets;
   - one correct suit showcase screenshot for related suits.
3. Do not invent paths. Do not use any URL unless you have opened it and confirmed non-zero image dimensions.
4. Update media mappings, not merely docs.

# REQUIREMENTS

1. Repair the missing 6 villain, 4 ally, and 5 variant runtime images.
2. Repair all 18 suit, 16 gadget, and 28 skill/move runtime images.
3. Ensure every data entry's `mediaId` resolves to an actual `MEDIA_CATALOG` entry and every renderer uses it.
4. Keep portrait framing for characters/suits and landscape framing for gadget/skill screenshots.
5. Preserve existing SVG fallback only as network-failure resilience.
6. Do not edit root `app.js`; active controller is `js/app.js`.
7. Do not change gameplay, map, progression, or sound logic.
8. Use file/browser tools only; no shell/run-command tools.

# MANDATORY RUNTIME TEST

You MUST test the final application at `http://127.0.0.1:4176/`:

1. Reload after edits.
2. Visit each of Villains, Allies, Collection → Spider-Verse, Suits, Gadgets, and Skills.
3. Scroll every card into view to trigger `loading="lazy"`.
4. For each gallery count:
   - total cards;
   - `<img>` elements remaining after `onerror` handling;
   - images where `complete === true && naturalWidth > 0`.
5. The final counts must be exactly:
   - Villains 30/30;
   - Allies 24/24;
   - Variants 18/18;
   - Suits 18/18;
   - Gadgets 16/16;
   - Skills 28/28.
6. If any gallery does not meet its target, continue fixing it; do not claim completion.
7. Capture actual DOM evidence in the final response.
8. Only after runtime passes, correct the coverage documentation.

# ACCEPTANCE CRITERIA

- Runtime DOM shows 134 successful images across 134 cards after full lazy-load scrolling.
- Zero failed or removed image elements.
- No broken-image icons and no console errors.
- Source chips/credits remain accurate for reused media.
- Search/filter/detail actions still work.
- SFX/BGM settings still persist.

