# TASK 35 — V6 Mobile Two-Row Header Fix

Work only in `app-v6/`. Preserve all map/data behavior.

## Root cause verified in browser and source

`.frame-action-bar` is a child of `.frame-top-bar`, but mobile CSS keeps `.frame-top-bar` at 54px with single-row flex. The action bar therefore occupies the same row and visually pushes/hides the brand plaque. Screenshot at 390px shows tiny avatar fragments + THÊM/NHẬT KÝ/NOTION, with no readable `WEB OPS TRACKER` title.

## Required surgical solution

At `max-width: 800px`:

- Make `.frame-top-bar` a real two-row grid with total height/min-height 100px:
  - columns: `64px minmax(0, 1fr) 88px`;
  - rows: `54px 46px`;
  - row 1: `.avatar-control-box` column 1, `.brand-plaque` column 2, `.top-right-controls` column 3;
  - row 2: `.frame-action-bar` spans columns 1 / -1.
- Keep the brand title fully visible, centered, one line. Hide only the subtitle/clock.
- Avatar may show image + status dot; GPS text may be visually hidden if space is insufficient, but keep accessible title.
- Sound/Menu utilities should render as compact icon-only 40–44px buttons on mobile with correct accessible labels; do not allow literal `SFX`/`MENU` text to squeeze the brand.
- Action bar remains four equal 44px controls with labels.
- Search and filter rows remain below the 100px header and map fills remaining space.
- Verify screenshot at 390x844 and 360x800: readable `WEB OPS TRACKER`, no overlap, no clipped actions, no horizontal document overflow.

