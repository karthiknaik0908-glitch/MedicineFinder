import React from 'react';
import Modal from '../common/Modal';
import { getGoogleMapsDirectionsUrl, formatDistance } from '../../utils/distance';
import { MapPin, Navigation, Phone, Clock, ExternalLink } from 'lucide-react';

export default function DirectionsModal({ isOpen, onClose, pharmacy, distance }) {
  if (!pharmacy) return null;

  const mapsUrl = getGoogleMapsDirectionsUrl(
    pharmacy.latitude,
    pharmacy.longitude,
    pharmacy.name
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pharmacy Location & Directions" maxWidth="max-w-lg">
      <div className="space-y-5">
        
        {/* Pharmacy header summary */}
        <div className="flex gap-4 items-start">
          <img
            src={pharmacy.image || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=400&q=80'}
            alt={pharmacy.name}
            className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div>
            <h4 className="text-base font-bold text-slate-900">{pharmacy.name}</h4>
            <p className="text-xs text-brand-600 font-medium">{pharmacy.tagline}</p>
            {distance !== null && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                <Navigation className="w-3 h-3" />
                {formatDistance(distance)}
              </span>
            )}
          </div>
        </div>

        {/* Address and info box */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-700">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">Address:</span>
              <span>{pharmacy.address}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">Phone:</span>
              <a href={`tel:${pharmacy.phone}`} className="text-brand-600 hover:underline">
                {pharmacy.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">Operating Hours:</span>
              <span>{pharmacy.openingHours}</span>
            </div>
          </div>
        </div>

        {/* Maps coordinates details */}
        <div className="text-[11px] text-slate-400 bg-slate-100/60 p-2.5 rounded-lg flex justify-between">
          <span>GPS Coordinates: {pharmacy.latitude}, {pharmacy.longitude}</span>
          <span>Verified Pharmacy License: {pharmacy.licenseNumber || 'Active'}</span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition"
          >
            <Navigation className="w-4 h-4" />
            Open in Google Maps
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>

          <a
            href={`tel:${pharmacy.phone}`}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
          >
            <Phone className="w-4 h-4" />
            Call Pharmacy
          </a>
        </div>

      </div>
    </Modal>
  );
}
