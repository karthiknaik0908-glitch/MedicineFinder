import {
  calculateDistance,
  formatDistance,
  getGoogleMapsDirectionsUrl,
  getGoogleMapsViewUrl
} from '../utils/distance';

export const geoService = {
  calculateDistance,
  formatDistance,
  getGoogleMapsDirectionsUrl,
  getGoogleMapsViewUrl,

  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }
};
