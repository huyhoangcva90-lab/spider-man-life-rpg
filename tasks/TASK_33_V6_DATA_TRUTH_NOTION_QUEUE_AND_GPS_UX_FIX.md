# TASK 33 — V6 Data Truth, Notion Queue & GPS UX Fix

Work only in `app-v6/`.

## Browser QA defects

The map and tracker frame render correctly, but these defects block acceptance:

1. Header displays `NOTION (0)` even though `data/notion-snapshot.json` has real Master Calendar records. Root cause: `UnlocatedMissionQueue.init()/render` occurs before `NotionAdapter.loadSnapshot()` and is never refreshed afterward.
2. First boot automatically persists five fabricated Hanoi sample entries, including a fake Notion URL. This violates data truth and makes the real-life personal map misleading.
3. Map defaults to Hanoi without labeling it as a fallback, while the user context is Asia/Saigon. It should default to Ho Chi Minh City only as a configurable fallback until GPS is enabled.
4. GPS permission is requested automatically during boot. Browser QA denied it, leaving a harsh `TỪ CHỐI QUYỀN GPS` status before the user chose anything. GPS must be requested from a user gesture.
5. Closed drawers/modals/forms remain in the accessibility tree. Closed UI must be hidden/inert, not merely visually offscreen.

## Required fixes

### Notion queue

- After `await notion.loadSnapshot()`, call a public refresh/render method on the queue and update the header badge immediately.
- Queue real unfinished `masterCalendar` records without valid coordinates; do not fabricate coordinates.
- Prefer Master Calendar for the geographic mission queue. Do not flood it with all habits/goals unless those records explicitly carry a usable address/coordinates.
- Badge should show the exact pending unlocated count (expected 10 for the current snapshot before any assignments).
- Assignment flow: choose real mission → click map → create NOTION_MISSION entry → preserve exact `sourceUrl` → remove from queue → update marker/filter/badge → persist across reload.

### Remove misleading seed data

- Do not auto-seed sample entries on first boot.
- Add a one-time migration: if stored entries are only `seed-entry-*` demo records, remove them automatically.
- If a demo is desired, expose an explicit `Load demo data` action in Help; tag entries `source: DEMO`, show `DEMO` badge, remove all fake Notion links, and provide `Clear demo data`.
- Never mix demo entries into the user’s real map silently.

### Default position and GPS

- Make fallback center configurable and set default fallback to Ho Chi Minh City (`lng 106.7009`, `lat 10.7769`) with UI copy `Vị trí mặc định — bật GPS để định vị chính xác`.
- Do not call `startTracking()` at boot.
- The Center GPS / Track button should initiate geolocation on click using `enableHighAccuracy: true`, then center and show reported accuracy in meters.
- Clear states: `GPS chưa bật`, `Đang xin quyền`, `GPS ±Xm`, `GPS bị từ chối`, `GPS không khả dụng`.
- GPS accuracy must remain honest and HTTPS/localhost requirement visible in Help.

### Accessibility/DOM truth

- Closed drawers/modals must use `hidden`, `inert` and/or be conditionally omitted so they do not appear in accessibility snapshots.
- Opening/closing must update focus logically and Escape must close the topmost panel.
- Do not hide visible map controls or actual marker buttons.

## QA

1. Fresh storage: empty real map, HCMC fallback, `NOTION (10)`, no fake sample markers.
2. Existing seed-only storage: migrated to empty map automatically.
3. Open Notion queue, assign `Khu còn lại notion` to a clicked map position, verify exact Notion URL and count 9 after reload.
4. GPS is not requested until user clicks; test unavailable/denied states without console exception.
5. Accessibility snapshot while all panels closed must not contain editor fields, dossier, Activity Log or Notion queue content.
6. Desktop and mobile screenshots, all JS syntax checks, zero uncaught errors.

