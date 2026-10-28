# Spider personal applications

Updated 2026-10-28.

## Entry points

- `/?game=QUESTS`: Life Reset Day layout, custom Spider card compositions. To-dos, done, local per-day skips, due-date filters and search use the existing Master Calendar and Active Quests.
- `/?game=HABITS`: HelloHabit layout, groups, daily check, monthly history, stats and activity. Reads existing Habits, Daily, Habit Planner and Hero databases.
- `/?game=FIELD&spiderApp=timetable`: Sectograph-style circular Timetable with local event editor, recurring events, ICS import/export, month/timeline views and existing Google/Notion sources.

Legacy bookmarks redirect to these views; 66 Days retains its separate pathway. The main menu and Field aliases use the same Habit and Quest screens.

## Data and synchronization

All screens reuse the existing same-origin owner/Gambit session. No new integration token is requested. An unopened browser session can be opened with the existing Gambit password.

Habit completion is dated through `/api/habit-check`, not an undated Today checkbox. Only the current Vietnam day is writable. Reads use Daily.Habits relationships; older dates are read-only. Failed or conflicting actions remain pending/reviewable. Successful mutations refresh source data and notify the parent Spider screen. Quest mutations update the existing Done or Completed property. Skips are explicitly local visibility choices, not fabricated Notion states.

Timetable reads Google status/calendars/events through the existing server. Each selected date loads the day before, that day and the day after, with request versioning so a late old response cannot replace a new selection. The selected Google calendar IDs reuse `notionKingGoogleCalendar`. Notion Master Calendar, Active Quests and Routine provide additional events. Unknown end times are points, not invented busy intervals. Google all-day ends are exclusive; Notion all-day ends are inclusive. External events open their source for editing. Local events remain local and are labeled accordingly. Account writes and background notification delivery are not implemented by the existing Calendar endpoints.

## Artwork

The new Quest compositions combine the repository's existing rooftop/lab/subway SVG scenes and Cosmic Spider-Man sprite frames using CSS. Patrol, learning and recovery have separate compositions. Existing asset provenance remains in `assets/spideytracker/README.md`.

Three new raster illustrations were requested using the built-in image generator (patrol, study, recovery); all three outputs were rejected by that service. No newly generated raster illustration is claimed or included.

## Validation

- Node tests cover the shared session, dated history, confirmed/failed mutations, read-only caches, date switching, midnight durations, all-day semantics, due-date points and Routine mapping.
- Browser checks exercise actual Habit and Quest entry points, check/undo contracts, stats, local skips, source calendars, a local event, mobile overflow and main-menu routing. Browser write checks use isolated request fixtures, not the owner's Notion records.
- Local captures and the browser test result are in ignored/untracked `output/spider-personal-integration/`; they are not deployed as user records.
- Third-party calendar libraries and their licenses ship together under `field-tools/apps/timetable/vendor/`.
