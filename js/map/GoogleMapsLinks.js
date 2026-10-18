export function googleDirections(place) {
  const destination = Number.isFinite(place.lat) && Number.isFinite(place.lng)
    ? `${place.lat},${place.lng}` : String(place.address || '').trim();
  if (!destination) return null;
  const url = new URL('https://www.google.com/maps/dir/');
  url.search = new URLSearchParams({ api: '1', destination });
  return url.href;
}

export function googlePlaceSearch(place) {
  const url = new URL('https://www.google.com/maps/search/');
  url.search = new URLSearchParams({ api: '1', query: `${place.title || ''} ${place.address || ''} ${place.lat},${place.lng}`.trim() });
  return url.href;
}
