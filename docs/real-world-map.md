# Real-world map and Google navigation

CITY starts near the public Kim Lan road area in Bat Trang, Hanoi (20.9648722, 105.9055552),
resolved from OpenStreetMap Nominatim. This is an area camera default, not the user's exact home
or a claimed GPS fix. GPS remains opt-in.

The shared tracker frame is applied to the main app screens, standalone Life OS and Life Reset.
Nested life tools inherit their parent's frame instead of duplicating it. The PK embed only adds
the border and keeps navigation hidden.

Nearby venue discovery uses Nominatim's documented bounded amenity search, triggered only by
the Find action, cached in memory for ten minutes, and limited to 1, 3 or 5 km. The service returns
a selection of matches, not an exhaustive business directory. Only named places with valid
coordinates inside the requested radius are shown. Results are ordered by straight-line distance.
There are no invented ratings, prices or opening statuses. Tagged hours are shown as OSM data.

Google Maps URLs open the selected destination on the user's device for directions. The app
does not include a private task title, notes, or an origin in these direction URLs. Google handles
the origin/current location. Google review buttons perform a venue lookup; ratings stay in Google.
The current camera can also be opened in Google Maps via the map status card.

Real-world Notion task cards offer venue selection and a direct directions link when an address
exists. A chosen venue is associated with the task's Notion URL in the existing device map store.
This does not complete the task, write Notion properties, or sync private places across devices.
The map dossier retains the Google/Apple directions and share-to-phone actions.

References:
- https://developers.google.com/maps/documentation/urls/get-started
- https://nominatim.org/release-docs/latest/api/Search/
