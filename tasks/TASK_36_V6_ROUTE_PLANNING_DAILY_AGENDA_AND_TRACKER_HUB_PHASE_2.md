# TASK 36 — V6 Route Planning, Daily Agenda & Tracker Hub Phase 2

Work only in `C:\Users\huyklgl\Documents\antigravity\mysterious-kepler\app-v6`.
Preserve the working real map, Notion queue, data truth, GPS behavior and mobile layout.

## Objective

Continue V6 from a real marker map into a personal map-first planning system for meetings, people, plans, leisure and Notion missions. Keep the SpideyTracker-inspired pixel-device hub anatomy, but use only original WEB OPS TRACKER identity/assets/code.

## 1. Real route planner

- Add route mode launched from marker dossier or a dedicated `ROUTE` control.
- Origin choices: current GPS position, another saved marker, or searched place.
- Destination: selected marker/search result.
- Travel modes: driving, walking, cycling, public transit when supported by the configured provider.
- Create `RoutingProviderConfig` and adapters. Do not hard-code private keys.
- Support configured production routing endpoint/key through settings.
- Development fallback may call a clearly labeled low-volume demo routing endpoint only when permitted; otherwise show straight-line distance and external navigation links.
- Never fabricate route geometry, turn instructions, travel time or ETA.
- Render returned route geometry as a bright web-line on MapLibre with start/end markers, distance, duration, ETA and provider attribution.
- Clear route and swap origin/destination controls.
- Route errors must be recoverable and explain whether the provider/key/network is missing.

## 2. Daily map agenda

- Add a bottom ticker/panel inspired by the reference Activity Log, called `PATROL AGENDA`.
- Sections: Now, Next, Today, Upcoming, Unscheduled.
- Entries combine saved MapEntry dates and located Notion missions.
- Timeline item shows time, type, title, person, status, distance from current location when GPS exists, and route/center actions.
- Do not compute travel lateness without a real route result. When route data exists, show `Rời đi lúc` and an honest late-risk warning.
- Selecting an agenda item focuses its marker and opens dossier.

## 3. People and plans relationship model

- Add stable `personId`/person contact records stored locally: display name, notes, preferred places, optional phone/email, privacy label.
- A meeting/plan can reference a person and multiple related Notion URLs.
- Add `People` view/panel: select a person to see their saved places, upcoming meetings and completed visits on the map.
- Preserve backward compatibility with existing `personName` entries.
- Never expose private contact details in map labels by default.

## 4. Notion location lifecycle

- Located Notion markers need a visible source/provenance badge.
- Allow `Unassign location` without deleting the Notion mission; it returns to the queue.
- Deleting a located Notion marker must offer: `Remove map location only` (default) vs cancel. Never imply deleting the Notion page.
- Preserve exact source URL and completion/status fields.
- Add an optional local `locationOverride` record keyed by Notion page ID so future snapshot refreshes retain assigned locations.

## 5. Tracker hub polish

- Add original marker legend/onboarding matching the reference rhythm: confirmed/planned/done/cancelled plus category icons.
- Improve selected marker and route focus animation while respecting reduced motion.
- Activity/agenda panels use the reference-like side drawer on desktop and bottom sheet on mobile.
- Keep the map visible behind panels.
- Add a compact coordinates/share button that copies a text summary and map coordinates; do not silently publish anything.

## 6. Settings/provider panel

- Provider status cards for tiles, geocoder and routing: active provider, production-ready status, key configured/missing, last error.
- Keys must never be committed or stored in source. If browser-local configuration is supported, explain privacy risk and prefer server-side proxy for production.
- Clearly show HTTPS requirement for GPS.
- Keep OSM/Nominatim attribution and usage limits visible.

## 7. QA

- Migrate existing V6 localStorage without data loss.
- Test route fallback with no key; test adapter with a mocked valid route response; verify no fake ETA when unavailable.
- Test agenda grouping and marker focus.
- Test People create/edit/link flow.
- Test Notion unassign and reassignment persists across reload.
- Test desktop 1440x1000, mobile 390x844 and 360x800 screenshots.
- Zero uncaught console errors; syntax check every JS module; no mojibake or horizontal document overflow.

At handoff report exact files changed, tests, provider limitations and any feature that needs a real API key/backend.

