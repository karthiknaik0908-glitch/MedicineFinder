import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from '../../utils/distance';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import DirectionsModal from './DirectionsModal';

export default function PharmacyCard({ pharmacy, medicinesCount = 0, distance }) {
  const [directionsOpen, setDirectionsOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between">
        
        {/* Pharmacy Image & Banner */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <img
            src={pharmacy.image || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80'}
            alt={pharmacy.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Distance pill on top right */}
          {distance !== null && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-brand-800 text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-brand-600" />
              {formatDistance(distance)}
            </div>
          )}

          {/* Verification Badge */}
          <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Rx
          </div>

          {/* Name & Tagline at bottom of image */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="text-lg font-bold leading-tight drop-shadow-sm">{pharmacy.name}</h3>
            <p className="text-xs text-slate-200 truncate drop-shadow-xs">{pharmacy.tagline}</p>
          </div>
        </div>

        {/* Content details */}
        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-2 text-xs text-slate-600">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">{pharmacy.address}</span>
            </p>

            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-600 shrink-0" />
              <a href={`tel:${pharmacy.phone}`} className="hover:text-brand-600 font-medium">
                {pharmacy.phone}
              </a>
            </p>

            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{pharmacy.openingHours}</span>
            </p>
          </div>

          {/* Facilities pills */}
          {pharmacy.facilities && pharmacy.facilities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {pharmacy.facilities.slice(0, 3).map((f) => (
                <span
                  key={f}
                  className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md"
                >
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* Inventory summary & actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              <span>{medicinesCount} Medicines Listed</span>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDirectionsOpen(true)}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                title="Get directions"
              >
                <Navigation className="w-4 h-4 text-brand-600" />
              </button>

              <Link
                to={`/pharmacy/${pharmacy.id}`}
                className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition"
              >
                <span>View Inventory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      <DirectionsModal
        isOpen={directionsOpen}
        onClose={() => setDirectionsOpen(false)}
        pharmacy={pharmacy}
        distance={distance}
      />
    </>
  );
}
