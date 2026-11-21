import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateDistance } from '../utils/distance';

const LocationContext = createContext(null);

// Popular cities / metro areas for manual fallback selection
export const AREA_PRESETS = [
  { name: 'New York (Downtown)', lat: 40.7128, lng: -74.0060 },
  { name: 'Manhattan (Midtown)', lat: 40.7549, lng: -73.9840 },
  { name: 'East Village (NYC)', lat: 40.7264, lng: -73.9818 },
  { name: 'Brooklyn (Heights)', lat: 40.6958, lng: -73.9936 },
  { name: 'Queens (Long Island City)', lat: 40.7447, lng: -73.9485 },
  { name: 'Jersey City (Downtown)', lat: 40.7178, lng: -74.0431 }
];

export function LocationProvider({ children }) {
  // Default starting coordinates (New York City downtown)
  const defaultLat = parseFloat(import.meta.env.VITE_DEFAULT_LAT) || 40.7128;
  const defaultLng = parseFloat(import.meta.env.VITE_DEFAULT_LNG) || -74.0060;
  const defaultCity = import.meta.env.VITE_DEFAULT_CITY || 'New York';

  const [coords, setCoords] = useState({ latitude: defaultLat, longitude: defaultLng });
  const [cityName, setCityName] = useState(defaultCity);
  const [locationStatus, setLocationStatus] = useState('prompt'); // 'prompt' | 'granted' | 'denied' | 'error'
  const [isLocating, setIsLocating] = useState(false);
  const [locationErrorMsg, setLocationErrorMsg] = useState('');

  // Request real device GPS via navigator.geolocation
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setLocationErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        setLocationStatus('granted');
        setIsLocating(false);
        setCityName('Current Location');
      },
      (error) => {
        setIsLocating(false);
        setLocationStatus('denied');
        if (error.code === error.PERMISSION_DENIED) {
          setLocationErrorMsg('Location access was denied. You can select an area or search below.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationErrorMsg('Location information is unavailable.');
        } else if (error.code === error.TIMEOUT) {
          setLocationErrorMsg('Location request timed out.');
        } else {
          setLocationErrorMsg('An error occurred getting your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Allow setting a manual city / area when permission is denied or customer prefers another city
  const setManualLocation = (lat, lng, name) => {
    setCoords({ latitude: Number(lat), longitude: Number(lng) });
    setCityName(name);
    setLocationStatus('manual');
    setLocationErrorMsg('');
  };

  // Helper to compute distance from current customer coordinates to a pharmacy
  const getDistanceFromUser = (pharmacyLat, pharmacyLng) => {
    if (!coords || !coords.latitude || !coords.longitude) return null;
    return calculateDistance(coords.latitude, coords.longitude, pharmacyLat, pharmacyLng);
  };

  return (
    <LocationContext.Provider
      value={{
        coords,
        cityName,
        locationStatus,
        isLocating,
        locationErrorMsg,
        requestLocation,
        setManualLocation,
        getDistanceFromUser
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
