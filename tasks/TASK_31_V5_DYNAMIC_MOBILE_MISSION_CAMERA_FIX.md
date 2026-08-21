# TASK 31 — V5 Dynamic Mobile Mission Camera Fix

Work only in `app-v5/`.

## Failed post-Task-30 screenshot evidence at 390x844

- Current saved state has first mission completed; primary CTA correctly selects pending mission `Chuẩn hoá Habit 9 Mood`.
- Mobile camera is still hard-coded to `district-core`, while that active pending mission is in the Habits district. Its mission beacon is therefore cropped at the upper-right edge and is not tappable/legible in the opening composition.
- `Reset Camera` overlaps the right side of the primary briefing CTA.
- CTA label is clipped because reset consumes the same bottom band.

## Required surgical fix

1. Mobile initial/reset camera must derive its focus target from the same first pending mission used by the primary CTA. Center that mission's district and beacon—not a hard-coded district.
2. Recompute after hydration, mission completion, resize/orientation change, and when returning to City.
3. Opening mobile screenshot must show the complete pending beacon pulse, icon and short label inside the safe visible map region above CTA.
4. Move Reset Camera on mobile to a compact independent control near the map's upper-right below the identity HUD, or hide it behind a map-controls toggle. It must never overlap the briefing CTA, dock, beacon or HUD.
5. Primary CTA must have its own full-width safe row and truncate only the mission title cleanly with ellipsis.
6. Validate both clean state and a state where mission 1 is completed and mission 2 becomes active.
7. Test 390x844 and 360x800 screenshots, console, focus loop preservation, and JS syntax.

Acceptance: in the current QA state, `Chuẩn hoá Habit 9 Mood` beacon is fully visible and CTA + Reset do not overlap.

