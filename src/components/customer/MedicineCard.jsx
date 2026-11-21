import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StockBadge from '../common/StockBadge';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { formatDistance } from '../../utils/distance';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Store
} from 'lucide-react';
import DirectionsModal from './DirectionsModal';

export default function MedicineCard({ medicine, pharmacy, distance }) {
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between">
        
        {/* Top Section */}
        <div className="p-5">
          <div className="flex gap-4">
            
            {/* Medicine thumbnail */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0">
              <img
                src={medicine.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80'}
                alt={medicine.name}
                className="w-full h-full object-cover group-hover:scale-105 transition"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80';
                }}
              />
              {medicine.prescriptionRequired && (
                <span className="absolute top-1 left-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                  Rx
                </span>
              )}
            </div>

            {/* Medicine details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider block">
                    {medicine.category || 'General Medicine'}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug truncate">
                    {medicine.name}
                  </h3>
                </div>
                {/* Price */}
                <div className="text-right shrink-0">
                  <span className="text-lg font-extrabold text-slate-900 block">
                    {formatCurrency(medicine.price)}
                  </span>
                  <span className="text-[11px] text-slate-400">per unit</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 truncate mt-0.5">
                Generic: <span className="font-medium text-slate-700">{medicine.genericName || medicine.brand}</span>
              </p>

              {medicine.dosageForm && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Form: {medicine.dosageForm}
                </p>
              )}

              {/* Stock status pill & last update */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StockBadge quantity={medicine.quantity} />
                <span className="text-[11px] text-slate-400">
                  Updated {formatRelativeTime(medicine.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pharmacy Association Box */}
        {pharmacy && (
          <div className="bg-slate-50/80 border-t border-slate-100 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <Store className="w-4 h-4 text-brand-600 shrink-0" />
                <Link
                  to={`/pharmacy/${pharmacy.id}`}
                  className="text-xs font-bold text-slate-800 hover:text-brand-600 transition truncate"
                >
                  {pharmacy.name}
                </Link>
              </div>
              {distance !== null && (
                <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full shrink-0">
                  {formatDistance(distance)}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{pharmacy.address}</span>
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[150px]">{pharmacy.openingHours}</span>
              </span>
              <a
                href={`tel:${pharmacy.phone}`}
                className="flex items-center gap-1 text-brand-600 font-medium hover:underline shrink-0"
              >
                <Phone className="w-3 h-3" />
                {pharmacy.phone}
              </a>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDirectionsModalOpen(true)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold shadow-xs transition"
              >
                <Navigation className="w-3.5 h-3.5 text-brand-600" />
                Get Directions
              </button>

              <Link
                to={`/pharmacy/${pharmacy.id}`}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition"
              >
                <span>View Pharmacy</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Directions modal */}
      {pharmacy && (
        <DirectionsModal
          isOpen={directionsModalOpen}
          onClose={() => setDirectionsModalOpen(false)}
          pharmacy={pharmacy}
          distance={distance}
        />
      )}
    </>
  );
}
