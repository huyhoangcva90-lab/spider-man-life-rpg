# Original Gambit import verification

## Merge into the current Spider branch (2026-10-18)

The previously uncommitted import from the “Đồng bộ Gambit với GitHub” chat is now
integrated with the newer Notion-authoritative battle, shared tracker frame and real-world map.
All 181 files from that chat's `gambit/` directory are included, with original license and artwork.
Only the Field integration methods were merged into the current controller; older combat,
Notion-sync and layout implementations from that checkout were not used to overwrite newer work.

The tools open in an immersive Field view with a return control, as requested in that chat.
Returning clears `spiderApp` from the URL and restores the framed Spider Apps screen. The return
control has reserved space so it does not cover an app's own navigation. App frames remain mounted
during unrelated refreshes. Messages validate both the exact frame window and same origin.

Production checks before publishing returned 404 for `/api/cloud`, `/api/google` and `/api/finance`.
Backend-dependent tools therefore explicitly show “Đồng bộ trực tuyến chưa kết nối”. No backend,
keys, authentication settings, private records or data migrations are included in this merge.
Rendering and navigation are not evidence of working remote sync.

Date: 2026-10-18

Source: `D:/test/Zenflow-main/Gambit-main`. Source commit matches GitHub HEAD `6244b61f2bee85f858c1be913170175b2db9906e`; local Finance modifications are included as requested. No source files changed.

Imported original frontend under `gambit/`, retaining app folders, shared React and Tabler dependencies, fonts, Tarot resources, app guard, source homepage, manifest, service worker and MIT license. Original app code receives no Spider styling. 174 app/shared resource files were byte-compared with source with zero mismatches before adding the original homepage files.

| App | Local entry | Verified | Backend references detected |
| --- | --- | --- | --- |
| Routine | gambit/apps/routine/index.html | Page renders | /api/cloud |
| Dopamine | gambit/apps/dopamine/index.html | Page renders | /api/cloud |
| Timetable | gambit/apps/timetable/index.html | Page renders | /api/google |
| Gym | gambit/apps/gym/index.html | Page renders | /api/notion |
| Habits | gambit/apps/habits/index.html | Page renders | /api/cloud, /api/notion |
| Journal | gambit/apps/journal/index.html | Page renders | No /api references detected |
| Todo | gambit/apps/todo/index.html | Page renders | /api/notion |
| English | gambit/apps/english/index.html | Page renders | /api/v2 (external dictionary reference) |
| Oracle | gambit/apps/oracle/index.html | Page renders | No /api references detected |
| Style30 | gambit/apps/style30/index.html | Page renders | No /api references detected |
| Someday | gambit/apps/someday/index.html | Page renders | No /api references detected |
| Finance | gambit/apps/finance/index.html | Page renders | /api/finance, /api/finance-v2, /api/cloud |

All imported standalone JS files passed Node syntax checks. Each app was opened individually and its rendered UI inspected in the browser. Existing Life OS hash bookmarks for today/routine/dopamine/timetable/habits/journal/gym now open original local apps through `life-os/original-gambit-routes.js`. The old Dopamine bookmark was verified to land on the original app. Life Reset and game features stay available.

Rendering is verified; authenticated API calls, writes, OAuth, audio, imports and every secondary workflow are not verified. No backend is copied, no credentials are copied, and no deployment is performed. Static localhost preview does not provide Gambit API endpoints. This import preserves upstream storage behavior, which differs from the previous Spider-specific storage keys and Notion-only policy. No existing data is migrated or deleted.

Antigravity execution: scoped file permissions were temporarily added and restored in finally blocks. The broad task produced no changes and was stopped; the narrow menu task timed out after 90 seconds without edits. Codex performed the byte-for-byte filesystem copy, browser verification and menu wiring directly. No permission bypass flag was used.

## Integration follow-up

Original application HTML/CSS/JS stays unchanged. The imported homepage and service worker now include deliberate integration changes:
- Homepage links back to Spider and to the original live Gambit service, states backend dependency, exposes the missing Someday app and counts 13 entries (12 apps plus Jarvis).
- Removed the unverified Notion Sync: Active claim from the homepage.
- Service worker uses a Spider-specific cache prefix, deletes only outdated caches with that prefix, handles only same-origin Gambit paths, and returns an explicit offline response for uncached pages. It preserves caches belonging to Spider or other applications.
- Preview server supports directory index routes, HEAD, font/manifest MIME types, and rejects hidden private paths.

Verification: `node tools/test_gambit_integration.mjs` passes route checks for all 12 apps, private-file denial, MIME/HEAD checks, cache cleanup isolation, fetch scope exclusions, and offline cache miss. Browser preview for these changes runs at http://127.0.0.1:4187/gambit/ (4173 may still run the earlier preview process).

## Spider Field integration (supersedes standalone launch flow)

The 12 tools now open within the existing Spider Field panel, retaining Spider navigation and a Spider Apps return button. TIME/GYM/JOURNAL tabs open their corresponding tools within the same panel. Existing Life OS links route to Spider with an allowlisted app identifier. App content stays mounted across incidental panel updates so live Notion refreshes do not discard an in-progress form.

Antigravity successfully generated `tasks/antigravity-field/spider-embedded-theme.css` and `spider-embedded.js` using a scoped, isolated task. Codex reviewed, installed and wired these into Spider, with additional theme-token mappings. Each app HTML only adds the embed bootstrap; original application logic remains intact. The theme activates only with `spiderEmbed=1`. No fetch, storage, credentials or authentication behavior is replaced.

Embedded-home messages validate both same origin and exact child window. Unknown app identifiers are rejected. Backend-dependent features remain dependent on the configured service; opening inside Spider does not establish backend connectivity.

Browser verification of embedded flow: all 12 app cards mounted within Spider Field without changing the top-level URL; Dopamine category navigation worked; returning to Spider Apps restored 14 tool cards; GYM tab loaded its themed original app; SYSTEMS returned to the tools grid. Theme activation confirmed in Routine and Gym documents. Mobile 390px screenshot confirmed visible Spider navigation and sticky return controls. Backend writes were not exercised. Antigravity settings were restored after successful generation.
