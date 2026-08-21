/* WEB OPS TRACKER V6 - MAP PROVIDER CONFIGURATION */

export class MapProviderConfig {
  static getProviderConfig(providerType = 'CARTO_DARK', apiKey = '') {
    switch (providerType) {
      case 'MAPTILER':
        return {
          name: 'MapTiler Vector',
          styleUrl: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${apiKey || 'get_your_maptiler_key'}`,
          attribution: '© MapTiler © OpenStreetMap contributors',
          isProductionReady: true
        };
      case 'OSM_RASTER':
        return {
          name: 'OSM Standard Raster (Dev Fallback)',
          styleUrl: {
            version: 8,
            sources: {
              'osm-raster': {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors'
              }
            },
            layers: [{
              id: 'osm-raster-layer',
              type: 'raster',
              source: 'osm-raster',
              minzoom: 0,
              maxzoom: 19
            }]
          },
          attribution: '© OpenStreetMap contributors (Dev Fallback)',
          isProductionReady: false
        };
      case 'CARTO_DARK':
      default:
        return {
          name: 'Carto Dark Matter (Default Vector)',
          styleUrl: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
          attribution: '© CARTO © OpenStreetMap contributors',
          isProductionReady: true
        };
    }
  }

  static getGeocoderEndpoint() {
    return 'https://nominatim.openstreetmap.org/search';
  }

  static getReverseGeocoderEndpoint() {
    return 'https://nominatim.openstreetmap.org/reverse';
  }

  static getRoutingEndpoint() {
    // Return null when no commercial routing API key configured
    return null;
  }
}
