/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 * @param {number} lat1 Latitude of point 1 in degrees
 * @param {number} lon1 Longitude of point 1 in degrees
 * @param {number} lat2 Latitude of point 2 in degrees
 * @param {number} lon2 Longitude of point 2 in degrees
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (
    lat1 === undefined || lat1 === null ||
    lon1 === undefined || lon1 === null ||
    lat2 === undefined || lat2 === null ||
    lon2 === undefined || lon2 === null
  ) {
    return null;
  }

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's mean radius in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place (e.g. 2.4 km)
}

/**
 * Format distance nicely for human display
 * @param {number|null} km Distance in km
 * @returns {string} Formatted string
 */
export function formatDistance(km) {
  if (km === null || km === undefined || isNaN(km)) return 'Distance unavailable';
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }
  return `${km.toFixed(1)} km away`;
}

/**
 * Generate Google Maps directions URL
 * @param {number} lat
 * @param {number} lng
 * @param {string} destinationName
 * @returns {string} URL
 */
export function getGoogleMapsDirectionsUrl(lat, lng, destinationName = '') {
  if (!lat || !lng) return '#';
  const query = destinationName ? encodeURIComponent(destinationName) : `${lat},${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${query}`;
}

/**
 * Generate Google Maps place view URL
 * @param {number} lat
 * @param {number} lng
 * @param {string} destinationName
 * @returns {string} URL
 */
export function getGoogleMapsViewUrl(lat, lng, destinationName = '') {
  if (!lat || !lng) return '#';
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
