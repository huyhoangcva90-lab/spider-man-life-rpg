/* WEB OPS TRACKER V6 - ROUTING ADAPTER */
import { MapProviderConfig } from './MapProviderConfig.js';

export class RoutingAdapter {
  // Haversine formula for straight-line geodesic distance in kilometers
  static calculateDistanceKm(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return parseFloat(d.toFixed(2));
  }

  static formatDistance(distanceKm) {
    if (distanceKm === null || distanceKm === undefined) return 'N/A';
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm} km`;
  }

  static getDirectionsInfo(originLat, originLng, destLat, destLng) {
    const routingEndpoint = MapProviderConfig.getRoutingEndpoint();
    const distanceKm = this.calculateDistanceKm(originLat, originLng, destLat, destLng);
    const formattedDistance = this.formatDistance(distanceKm);

    return {
      distanceKm,
      formattedDistance,
      isRealTurnByTurn: !!routingEndpoint,
      label: routingEndpoint ? 'Lộ trình đường đi thực tế' : 'Khoảng cách đường thẳng (Chim bay)',
      externalLinks: {
        googleMaps: `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}${originLat ? `&origin=${originLat},${originLng}` : ''}`,
        appleMaps: `https://maps.apple.com/?daddr=${destLat},${destLng}${originLat ? `&saddr=${originLat},${originLng}` : ''}`,
        openStreetMap: `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${originLat ? `${originLat}%2C${originLng}` : ''}%3B${destLat}%2C${destLng}`
      }
    };
  }
}
