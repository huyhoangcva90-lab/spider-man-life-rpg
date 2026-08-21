# TASK 28 — QA Round 2 Runtime and Encoding Fix

Work ONLY in this exact workspace:
`C:\Users\huyklgl\Documents\antigravity\mysterious-kepler`

Do not use or write to any scratch workspace. Fix the current V4 app in place.

## Blocking defect

`app-v4/js/ui/WorldView.js` has `renderRefreshModal(snapshotTime)` accidentally inserted before the first `bindEvents()` method is closed. A second `bindEvents()` implementation also exists later. Chrome reports `SyntaxError: Unexpected token '{'` and the application renders blank.

## Required corrections

1. Make `WorldView.js` valid browser-native ES module syntax.
2. Keep exactly one `bindEvents()` method containing all required handlers: resolve, focus, snapshot-info open/close, living-web toggle, reward dismissal.
3. Keep `renderRefreshModal(snapshotTime)` as a separate class method.
4. Preserve conditional rendering of closed dialogs.
5. Fix all visible mojibake in V4 source files, especially Vietnamese `Chưa phân loại` and the Task → Project → Area → Goal arrow. Save all edited files as UTF-8.
6. Do not alter real Notion record URLs, provenance, `local_demo` filtering, or the read-only snapshot boundary.
7. Run syntax checks on every `app-v4/js/**/*.js` file and report exact checks performed.
8. Do not edit legacy root app files.

## Acceptance

- `http://127.0.0.1:<port>/app-v4/#/world` renders instead of blank.
- Browser console has no syntax/runtime error during initial render.
- World uses the first real Notion snapshot mission, not `Deliver Database Schema` or any local demo.
- No visible mojibake.

