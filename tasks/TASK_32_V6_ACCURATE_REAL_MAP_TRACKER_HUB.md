# TASK 32 — V6 Accurate Real-Map Tracker Hub

Work only in `C:\Users\huyklgl\Documents\antigravity\mysterious-kepler`.
Create a new `app-v6/`; do not modify/delete V4 or V5.

## Product reset

The user wants the visual and interaction model of `https://spideytracker.com/` / `https://spideytracker.net/` as the primary hub, but used for real life:

- meeting a person;
- appointments and plans;
- places to go for fun;
- errands and work visits;
- real Notion missions with geographic coordinates.

This is intended to become a personal high-accuracy alternative map hub, not a fictional SVG city.

Do not copy source code, trademarked logos, exact copyrighted sprites, or proprietary assets from the reference. Recreate the structural interaction and pixel-device feeling with original assets and the project’s own `WEB OPS TRACKER` identity.

## Reference anatomy observed in browser

- Full viewport real world map inside a thick cyan pixel-device frame.
- Compact logo/title centered in the top frame.
- Avatar/profile control top-left; menu/control top-right.
- Vertical filter buttons along left frame.
- Center/global/zoom controls on right.
- Activity Log opens as a scrollable side panel/list with status, title and date.
- Marker types are strongly color coded with a tiny icon and legend.
- A lower ticker/control strip and compact character callout sit on the bottom frame.
- Onboarding boot sequence and map guide explain marker types.
- Strong navy map treatment, cyan frame, amber instructional text, green/red/blue marker categories, pixel typography.

## Required real map engine

Use MapLibre GL JS as the map renderer. It supports vector/raster sources, custom markers, camera controls and browser geolocation.

### Provider architecture

Implement provider adapters/config, never hard-code a private key:

- `MapProviderConfig` with `MAP_STYLE_URL`, optional `MAPTILER_API_KEY`, geocoder endpoint and routing endpoint.
- Development fallback may use an OSM raster style with visible OpenStreetMap attribution for low-volume personal testing.
- Clearly label this fallback as development/best-effort, not production SLA.
- Never bulk-download tiles or implement offline prefetch against OSM public tile servers.
- Production provider seam should support MapTiler or another OSM-derived commercial/self-hosted source without rewriting UI.

### Geocoding policy

- Implement deliberate search only after Enter/Search click; no request-per-keystroke autocomplete against public Nominatim.
- Rate limit public Nominatim to max 1 request/sec, cache responses locally, show attribution, and allow endpoint switching.
- For production/high-volume, require configured provider API key or self-hosted geocoder.

### Location accuracy

- Browser Geolocation with `enableHighAccuracy: true`, `trackUserLocation: true`, and an accuracy circle.
- Show accuracy in meters and permission/error states honestly.
- Geolocation requires HTTPS outside localhost; show this requirement in UI.
- Never claim accuracy higher than the device-reported accuracy.

## Data model

Create `MapEntry` records:

```js
{
  id,
  type: 'MEETING' | 'PERSON' | 'PLAN' | 'LEISURE' | 'ERRAND' | 'WORK' | 'NOTION_MISSION',
  title,
  lat,
  lng,
  address,
  startsAt,
  endsAt,
  personName,
  notes,
  status: 'PLANNED' | 'CONFIRMED' | 'DONE' | 'CANCELLED',
  notionPageUrl,
  source,
  createdAt,
  updatedAt
}
```

- Persist user-created entries in localStorage with schema version/migration.
- Import/export GeoJSON and JSON backup.
- Keep Notion snapshot missions truthful. Only place a Notion mission on the geographic map when it has valid coordinates/address; otherwise show it in an `Unlocated missions` queue and let the user assign a location.
- Do not fabricate coordinates.

## Core flows

1. **Open map hub**: boot sequence → optional sound preference → map framed in original pixel tracker UI.
2. **Find a place**: search on explicit submit → results list → fly to result → save as meeting/plan/leisure/etc.
3. **Use current position**: request GPS → show dot + accuracy radius/meters → center/track toggle.
4. **Add from map**: long-press/right-click or `+ Add` → drop pin → reverse geocode if provider available → edit bottom sheet.
5. **Plan meeting**: choose person, date/time, notes and status → marker + activity log entry.
6. **Assign mission**: select unlocated Notion mission → search/drop pin → preserve exact Notion record URL.
7. **Marker details**: select marker → pixel dossier with time, person, notes, status, distance from user, direct Notion link, Edit, Done and Directions.
8. **Directions adapter**:
   - define provider seam for real routes/ETA;
   - when no routing provider is configured, show straight-line distance clearly labeled and offer external navigation fallback; never fabricate turn-by-turn instructions;
   - allow future OpenRouteService/Mapbox/Google/other provider configuration without UI rewrite.
9. **Activity Log**: filters, search, Today/Upcoming/Done, focus selected marker on map.
10. **Hub panels**: Missions, Operative, Hideout and Chronicle reuse truthful V5 data/game systems as framed overlays while the real map remains the background.

## Visual direction

Recreate the reference’s layout rhythm very closely, using original identity:

- thick stepped pixel frame in cyan/steel blue;
- deep navy real map recolored with a custom style/filter when possible;
- title plaque `WEB OPS TRACKER` centered at top;
- original web-operative avatar top-left;
- compact web emblem button top-right;
- left rail marker filters;
- right/bottom center/global/zoom controls;
- bottom activity ticker and optional sound toggle;
- original character art from `app-v4/assets/characters/web-operative-v1.png`, restrained and non-blocking;
- pixel UI typography plus readable Vietnamese body font;
- no generic dashboard cards, no persistent admin sidebar.

Primary UI language Vietnamese.

## Mobile

- 360x800 and 390x844 are first-class.
- Map remains the dominant surface.
- Panels become bottom sheets; marker filters become a compact horizontal strip.
- Safe areas, 44px targets, no horizontal page overflow.
- GPS/search/add controls remain reachable by thumb.

## Engineering structure

Suggested:

```text
app-v6/
  index.html
  css/{tokens,tracker-frame,map,panels,mobile}.css
  js/core/{EventBus,StateStore,StorageRepository}.js
  js/map/{MapEngine,MapProviderConfig,GeolocationController,GeocoderAdapter,RoutingAdapter,MarkerLayer}.js
  js/data/{MapEntryRepository,GeoJsonTransfer}.js
  js/ui/{BootSequence,TrackerFrame,SearchPanel,EntryEditor,ActivityLog,MarkerDossier,UnlocatedMissionQueue}.js
  js/integrations/notion/
  data/notion-snapshot.json
  assets/
```

## QA

1. JS syntax checks for all modules.
2. Real local HTTP test; map/provider failure must degrade into a clear recoverable state, never a blank screen.
3. Test map load, pan, zoom, search submit, GPS permission states, add/edit/delete/complete map entry, persistence, GeoJSON export/import, unlocated Notion assignment, filters and external navigation fallback.
4. Test desktop 1440x1000, mobile 390x844, 360x800.
5. Inspect screenshots against reference anatomy in three passes and fix defects.
6. Zero uncaught console errors and no mojibake.

## Acceptance

Within five seconds, the user recognizes the reference’s map-tracker hub structure and pixel-device energy, while seeing an actual geographically accurate map surface. Meetings, plans, leisure, errands and Notion missions can become real map markers without fabricated coordinates.

Report provider limitations honestly at handoff.

