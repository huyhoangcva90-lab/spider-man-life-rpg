# Spider Life OS

The seven daily systems are available at `life-os/` and can be opened
directly with hash routes such as `#routine`, `#dopamine`, and `#timetable`.

## Data ownership

- `routine` and `dopamine` are cloud-only. They never write their data to
  `localStorage` and use the Gambit `/api/cloud` contract with the isolated
  keys `spidery-routine-v1` and `spidery-dopamine-v1`.
- Today tasks, habits, Timetable items, workout plans, and workout activity use
  Notion through the Gambit `/api/notion` proxy. The checked/complete actions
  write back to Notion instead of creating per-device copies.
- When the live Notion proxy is unavailable, the committed Notion snapshot is
  displayed as an explicitly labelled read-only cache. It is never promoted to
  a second source of truth.
- Journal is Notion-only and intentionally does not fall back to localStorage.
  Configure its database with `data-notion-journal-database` on the `<html>`
  element once the journal database ID is confirmed.

The API origin is configured on the `<html data-cloud-origin="…">` element in
`index.html`. For production, the Gambit API must allow the Spidery deployment
origin and credentialed requests. The UI never silently falls back to local
persistence for the two cloud-only systems.
