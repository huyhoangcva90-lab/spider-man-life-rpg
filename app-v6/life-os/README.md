# Spider Life OS

The seven daily systems are available at `app-v6/life-os/` and can be opened
directly with hash routes such as `#routine`, `#dopamine`, and `#timetable`.

## Persistence

- `routine` and `dopamine` are cloud-only. They never write their data to
  `localStorage` and use the Gambit `/api/cloud` contract with the isolated
  keys `spidery-routine-v1` and `spidery-dopamine-v1`.
- Tasks, habits, journal entries, and workout logs use the single consolidated
  local key `spidery-life-os-v1`.

The cloud origin is configured on the `<html data-cloud-origin="…">` element in
`index.html`. For production, either host this directory on the Gambit origin or
allow the Spidery deployment origin in the Gambit API CORS policy. The UI never
silently falls back to local persistence for the two cloud-only systems; it
shows the offline state and retains unsaved changes only for the current tab.

