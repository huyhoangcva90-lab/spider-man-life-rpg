# TASK 34 — V6 Mobile Tracker Frame Composition

Work only in `app-v6/`. Preserve map/data/Notion/GPS behavior.

## Browser screenshot defects at 390x844

- Header tries to keep the full desktop composition; avatar/GPS/title/action text wraps into broken 2–4 character columns.
- Several header actions are clipped outside the viewport.
- Search bar collapses into a thin strip under the horizontal filter rail.
- The map itself and Notion marker render well, but the tracker frame above it looks unfinished.

## Required mobile composition

At `max-width: 767px`, redesign the frame—not just shrink desktop:

1. Top row (52–60px): compact avatar/GPS state left, centered `WEB OPS TRACKER` plaque readable in one line, menu/sound icon right.
2. Action row (44–48px): `THÊM`, `NHẬT KÝ`, `NOTION (n)`, `HƯỚNG DẪN` as 44px touch buttons in a horizontal scroll strip or compact four-column grid. No clipped labels.
3. Search row (44–48px): full-width search input plus square submit button; never collapse below 44px.
4. Filter row (44–48px): horizontally scrollable category controls with visible active state and counts.
5. Map fills all remaining space below these rows and above the bottom safe area.
6. Right map controls begin below filter row, do not cover the search/filter/header, and remain 44px.
7. Attribution stays readable but compact at bottom; ticker may be hidden or reduced on mobile.
8. No horizontal document overflow; only designated action/filter rows may scroll internally.
9. Keep the real Notion marker centered/visible after resize and keep drawer/modal bottom sheets functional.

Test screenshots at 390x844 and 360x800, visible text, touch targets, console, and JS syntax. Acceptance: no text broken into narrow vertical fragments and search is fully usable.

