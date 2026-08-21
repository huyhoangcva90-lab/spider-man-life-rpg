/* WEB OPS TRACKER V6 - GEOJSON TRANSFER */

export class GeoJsonTransfer {
  static exportGeoJSON(entries) {
    const geojson = {
      type: 'FeatureCollection',
      features: entries.map(entry => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [entry.lng, entry.lat]
        },
        properties: {
          id: entry.id,
          type: entry.type,
          title: entry.title,
          address: entry.address,
          startsAt: entry.startsAt,
          endsAt: entry.endsAt,
          personName: entry.personName,
          notes: entry.notes,
          status: entry.status,
          notionPageUrl: entry.notionPageUrl,
          source: entry.source,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `web-ops-tracker-export-${new Date().toISOString().split('T')[0]}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static async parseGeoJSONFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          if (json.type !== 'FeatureCollection' || !Array.isArray(json.features)) {
            throw new Error('Invalid GeoJSON FeatureCollection format');
          }

          const entries = json.features.map((f, idx) => {
            const props = f.properties || {};
            const coords = f.geometry?.coordinates || [105.85, 21.02];
            return {
              id: props.id || `geojson-${Date.now()}-${idx}`,
              type: props.type || 'MEETING',
              title: props.title || 'Địa điểm GeoJSON',
              lat: parseFloat(coords[1]),
              lng: parseFloat(coords[0]),
              address: props.address || '',
              startsAt: props.startsAt || new Date().toISOString(),
              endsAt: props.endsAt || new Date().toISOString(),
              personName: props.personName || '',
              notes: props.notes || '',
              status: props.status || 'PLANNED',
              notionPageUrl: props.notionPageUrl || '',
              source: 'GEOJSON_IMPORT',
              createdAt: props.createdAt || new Date().toISOString(),
              updatedAt: props.updatedAt || new Date().toISOString()
            };
          });

          resolve(entries);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsText(file);
    });
  }
}
