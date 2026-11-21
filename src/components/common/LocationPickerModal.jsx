import React, { useState } from 'react';
import Modal from './Modal';
import { useLocation, AREA_PRESETS } from '../../context/LocationContext';
import { Navigation, MapPin, Check, AlertCircle, Compass } from 'lucide-react';

export default function LocationPickerModal({ isOpen, onClose }) {
  const {
    coords,
    cityName,
    locationStatus,
    isLocating,
    locationErrorMsg,
    requestLocation,
    setManualLocation
  } = useLocation();

  const [customCity, setCustomCity] = useState('');

  const handleSelectPreset = (preset) => {
    setManualLocation(preset.lat, preset.lng, preset.name);
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customCity.trim()) return;
    // Map known names or default to NYC coordinates with custom name
    const match = AREA_PRESETS.find(p => p.name.toLowerCase().includes(customCity.toLowerCase()));
    if (match) {
      setManualLocation(match.lat, match.lng, match.name);
    } else {
      setManualLocation(40.7128, -74.0060, customCity.trim());
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Your Search Location" maxWidth="max-w-md">
      <div className="space-y-5">
        {/* Current status display */}
        <div className="flex items-center gap-3 p-3 bg-brand-50/70 border border-brand-100 rounded-xl text-brand-900">
          <MapPin className="w-5 h-5 text-brand-600 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold block text-sm text-brand-800">
              Active: {cityName}
            </span>
            <span className="text-slate-500">
              Coordinates: {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
            </span>
          </div>
        </div>

        {/* GPS Button */}
        <div>
          <button
            type="button"
            disabled={isLocating}
            onClick={async () => {
              await requestLocation();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm transition disabled:opacity-60"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            {isLocating ? 'Detecting device GPS...' : 'Use My Current GPS Location'}
          </button>
          {locationErrorMsg && (
            <p className="mt-2 text-xs text-rose-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {locationErrorMsg}
            </p>
          )}
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Or select area
          </span>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-2 gap-2">
          {AREA_PRESETS.map((preset) => {
            const isSelected =
              Math.abs(coords.latitude - preset.lat) < 0.001 &&
              Math.abs(coords.longitude - preset.lng) < 0.001;

            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs font-medium transition ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 text-brand-800 font-semibold ring-1 ring-brand-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{preset.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Custom text search */}
        <form onSubmit={handleCustomSubmit} className="pt-2">
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Or type city or neighborhood name:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Brooklyn, Midtown, Jersey City"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
