# TASK 30 — V5 MOBILE CAMERA & MISSION BEACON POLISH

Work only in `C:\Users\huyklgl\Documents\antigravity\mysterious-kepler\app-v5`.
Do not touch V4 or legacy root files.

## Independent QA evidence

V5 core loop passes, but browser screenshot at 390x844 fails the game-opening composition:

- initial map camera is shifted/cropped; district panels extend beyond the viewport and labels are clipped;
- the key-art ledge occupies too much of the mobile screen;
- no real mission beacon is visibly obvious in the opening viewport;
- the primary prompt and dock are close to overlapping the oversized art/map content;
- the opening view does not immediately communicate where the player should tap.

Desktop also needs a beacon clarity pass: district zones are visually large and empty, while actionable mission points are not prominent enough.

## Required corrections

1. Implement responsive initial camera presets:
   - desktop 1440x1000: frame the useful city graph and at least 3 mission beacons;
   - mobile 390x844 and 360x800: focus a central playable district with at least 1 real pending mission beacon fully visible above the primary prompt;
   - reset-camera must restore the correct preset for the current viewport.
2. Ensure the browser document never horizontally overflows. Map world may pan internally, but the page viewport must remain fixed.
3. Reduce/reframe hero key art on mobile so it supports the fantasy without covering the playable mission area. Keep it under roughly 30% of viewport height and avoid covering beacon hit targets.
4. Make each pending mission beacon visually unmistakable: bright pulse, mission symbol, short readable label, priority color, 44px touch target.
5. Add accessible DOM/ARIA mission-beacon controls synchronized with the canvas/SVG world so keyboard and browser accessibility users can select real missions. Do not expose duplicate hidden controls unnecessarily.
6. Keep the primary CTA and bottom dock separated with safe-area padding and no overlap at 360x800/390x844.
7. Preserve all passed behavior: focus pause/resume, idempotent completion, real Notion links, truthful snapshot labels, equipment effects.
8. Run JS syntax checks and browser QA at 1440x1000, 390x844, 360x800. Inspect screenshots, not only DOM.

## Acceptance

Within the mobile opening screenshot, the player can see: identity HUD, a readable portion of the living city, at least one real mission beacon, primary mission prompt, and bottom navigation without clipping or overlap.

