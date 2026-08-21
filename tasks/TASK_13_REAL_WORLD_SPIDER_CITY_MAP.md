# TASK

Real-World Spider City Map — MapLibre, Location, Search and Routing

# OBJECTIVE

Replace the static mission-map surface with a real interactive map suitable as a lightweight daily alternative to Google Maps, while keeping an original Spider Tracker visual system inspired by the reference interaction grammar.

# CONTEXT

Reference: `https://spideytracker.com/` redirects to `https://spideytracker.net/`. Useful patterns: boot/calibration, framed tracker device, world map, typed sightings, activity log, event/video/help panels, radar/scanner feedback and sound choice. Reproduce the useful product behavior and atmosphere, but do not copy its source code, exact layout, Sony branding, proprietary graphics, text, videos or audio. The result must be an original design, not a 1:1 clone.

The app is still vanilla HTML/CSS/JS with no backend. Use MapLibre GL JS and properly attributed open map data/services through configurable provider adapters. Keep the current SVG tracker as an offline/loading fallback.

# FILES

Likely: `index.html`, `styles.css`, `data/map.js`, new `js/map-provider.js`, `js/storage.js`, `js/app.js`, vendor files only if licensing permits, `docs/MAP_PROVIDERS.md`, `docs/IMPLEMENTATION_NOTES_TASK_13.md`. Do not edit root `app.js`.

# REQUIREMENTS

1. Implement a provider-neutral map adapter around MapLibre GL JS.
2. Real pan, zoom, rotate, pitch, fit bounds, scale, keyboard navigation and reset orientation.
3. “My location” uses browser geolocation only after an explicit user click and clear permission copy; never track in background.
4. Address/place search with debouncing, cancellation, result list and map fly-to through a configurable geocoder adapter.
5. Origin/destination routing with route line, distance, duration and basic step list through a configurable routing adapter.
6. Saved places and custom Life RPG mission pins stored locally; CRUD alone gives no progression rewards.
7. Layer toggles: missions, projects, bosses, allies, saved places and current location.
8. Spider Tracker presentation: boot/calibration, CRT frame, radar sweep, web-line route reveal, typed marker grammar, activity log, compact ticker and original synthesized cues.
9. Keep visible required attribution for MapLibre, map data and service providers. Document usage/rate-limit constraints; public demo endpoints are development-only.
10. Provide graceful offline/provider-error state using the existing code-native city SVG and locally stored pins.
11. Do not persist precise live location by default. If the user saves a place, require explicit action.
12. Mobile-first controls at 360px; large touch targets; no clipped panels or horizontal page overflow.

# DATA MODEL

```js
mapState: {
  providerId,
  camera: { center, zoom, bearing, pitch },
  selectedLayerIds: [],
  savedPlaces: [],
  customPins: [],
  lastSearchQuery: "",
  trackerOnboarded: true
}
```

Do not store continuous location history.

# ACCEPTANCE CRITERIA

- Real map renders and can pan/zoom/search/geolocate/route when configured providers are reachable.
- Map remains usable in fallback mode when network/providers fail.
- User can save a place and create a mission pin without accidental rewards.
- Required attribution is always visible.
- Design strongly evokes an original Spider Tracker console without copying proprietary assets/layout.
- Existing map-to-Quest/Project/Boss/Ally/Villain routing still works.
- No console errors; responsive desktop and 360px.

# DO NOT

- Do not copy the reference site 1:1 or reuse its code/assets/audio/branding.
- Do not hide attribution, exceed public-service policies or ship hard-coded secret API keys.
- Do not continuously track or persist the user’s location.
- Do not add a backend or framework.
- Do not edit root `app.js`.

# DELIVERABLE

Implement and document configuration, providers, privacy behavior, limitations and QA in `docs/IMPLEMENTATION_NOTES_TASK_13.md`.

