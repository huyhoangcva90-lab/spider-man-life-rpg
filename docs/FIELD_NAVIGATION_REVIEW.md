# Field navigation review — 2026-10-18

- [x] One host-owned back control for every Field tool, Quest and Habits.
- [x] Legacy home controls hidden in managed mode, including delayed React mounts.
- [x] Dedicated toolbar reserves space for back, app title and connection.
- [x] Extra mobile clearance below the animated frame corners.
- [x] Correct labels and routes: tool → Field → Home; Quest/Habits → Home.
- [x] Keyboard focus returns to the Field navigation control.
- [x] Habits heading and sync/settings actions wrap on narrow screens.
- [x] Embedded content announces DOM readiness; slow auxiliary resources no longer hold the loading overlay.
- [x] Nine relevant automated checks passed; all twelve Field directory routes and assets passed integration checks.
- [x] Browser checks: desktop-sized viewport and real 390 × 844 inner viewport; Routine back navigation and Todo connection dialog.

Private Notion record writes and financial operations were not performed during this UI check. Original frame assets, game authority and user data remain intact.

## 2026-10-19 update

- Individual tools (including Todo/Habits) now occupy the full viewport; Field directory and game pages retain the original frame.
- Left corner: tap opens menu, hold 700 ms returns Home. Movement, pointer cancellation and blur cancel the pending hold.
- Right corner: shortcuts for tasks, habits, timetable, finance, settings, and existing map tools.
- Three existing Spider clips are named in settings, with preview and stop controls. Clips no longer overlap; volume updates active clips and mute stops playback. A blocked boot greeting is no longer replayed on an unrelated click.
- Browser verified short tap, long hold, sound play/stop, 390 × 844 Finance layout. Two audio tests and thirteen Field/Notion authority tests passed; twelve tool routes passed.
