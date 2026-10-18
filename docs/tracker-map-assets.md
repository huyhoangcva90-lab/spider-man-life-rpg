# Tracker map presentation

The public SpideyTracker reference was captured on 2026-10-18 from https://spideytracker.com/.
Only interface artwork is used: existing frame slices, Spider-Man pixel sprites, filter buttons,
status pins and the globe control (`assets/spideytracker/map-ui/globe_btn.png`, 2,979 bytes).
No movie posters, film stills, real-person photos, promotional galleries, external tracking code,
or the downloaded website bundles are included in this update. Artwork retains its original ownership.

The real-world CITY screen uses MapLibre and CARTO Positron with OpenStreetMap data and attribution.
The map can pan, zoom, reset north, show the world, search and display existing places.
It does not import the reference website's sightings, private APIs, Google keys or tracking scripts.
The public reference archive stays outside the deployed app.

Hero's Notion Current Map still selects the battle background. CITY is geographical navigation;
changing its camera does not write a Hero map or any combat data to Notion.

The second map presentation pass removes battle navigation in CITY, places search at the bottom,
and uses the reference's 36/19/50/7 shell rows (27/14/40/5 on mobile). Radar uses the original
radar.png, map_center.png and globe_btn.png artwork with a new local canvas sweep. Dots come only
from existing, currently filtered places; there are no demo sightings or fabricated positions.
The original menu atlas is 46 cells of 81×83: 0–29 head loop, 30–45 close morph. The lower-left
figure uses 76 cells of 74×119, not the inverted preloader web sprite. Right alert rollover uses
alert_btn_black.png. No third-party reference JavaScript is loaded. The central logo links to /.
