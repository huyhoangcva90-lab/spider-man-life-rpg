# TASK

Full Marvel Character Card Catalog Foundation

# OBJECTIVE

Expand the current Collection into a scalable card-library experience that can represent every base Marvel SNAP character card available in a documented source snapshot, while preserving provenance, performance, fallbacks and the Life RPG progression rules.

# CONTEXT

The user wants all cards added through Antigravity. Interpret “all cards” as all base character cards in the selected documented catalog snapshot, not every cosmetic variant/split/border. Variants can be a later milestone. Existing 134 media entries and all current gameplay screens must remain intact.

This is a personal prototype. Do not scrape game files, bypass access controls, or fabricate image URLs. Prefer official/publicly documented card-library sources. Store a snapshot date, source URL and source name. If image redistribution/hotlink permission is unclear, keep metadata and use the existing safe fallback rather than copying the artwork.

# FILES

Likely: `data/cards.js`, `data/media.js`, `index.html`, `styles.css`, `js/storage.js`, `js/app.js`, `docs/ASSET_CREDITS.md`, `docs/IMPLEMENTATION_NOTES_TASK_12.md`. Do not edit root `app.js`.

# REQUIREMENTS

1. Add a dedicated `CARDS_DATA` catalog with stable IDs, name, cost, power, ability text where publicly documented, series/category, character tags, source metadata, image media reference and fallback.
2. Record `catalogSnapshotDate`, `catalogSourceName`, `catalogSourceUrl`, and the exact number of imported base cards.
3. Do not silently claim completeness: show “Catalog snapshot: DATE — N base cards” in the UI.
4. Add a Collection → Cards tab with virtualized/incremental rendering or pagination; do not eagerly insert hundreds of images.
5. Search by name/ability and filter by cost, power, series/category and owned/favorite status.
6. Add card detail modal/panel, keyboard navigation, visible focus, fixed image ratio, lazy loading, graceful fallback and zero-result state.
7. Persist only user-owned/favorite/filter UI state by stable IDs; merge defaults without resetting V2 progress.
8. Catalog browsing, favorites and ownership toggles are collection metadata only and never mint XP/Gold/loot or damage a boss.
9. Reuse media-card helpers and event delegation; avoid hundreds of duplicated listeners.
10. Responsive at 360px and desktop, no horizontal page overflow, reduced-motion support.

# ACCEPTANCE CRITERIA

- Every base character card from the documented snapshot exists exactly once with stable ID and source metadata.
- UI truthfully shows snapshot date and count.
- Search, filters, pagination/incremental rendering, detail, favorite and ownership work.
- Broken/blocked images fall back cleanly.
- Existing 14 screens, progression and 134 media assets still work.
- No console errors and all loaded JS parses.

# DO NOT

- Do not import all cosmetic variants in this milestone.
- Do not scrape/rip packaged game assets or bypass access controls.
- Do not fabricate attribution or hotlink unverified URLs.
- Do not add backend/framework/bundler.
- Do not edit root `app.js`.

# DELIVERABLE

Implement and write `docs/IMPLEMENTATION_NOTES_TASK_12.md` with source snapshot, exact count, changed files, QA and limitations.

