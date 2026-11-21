import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Search,
  Pill,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Building
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLocation } from '../context/LocationContext';
import { formatDistance, getGoogleMapsDirectionsUrl } from '../../src/utils/distance';
import StockBadge from '../components/common/StockBadge';
import { formatCurrency, formatRelativeTime, MEDICINE_CATEGORIES } from '../utils/formatters';
import DirectionsModal from '../components/customer/DirectionsModal';
import EmptyState from '../components/common/EmptyState';

export default function PharmacyDetailsPage() {
  const { id } = useParams();
  const { pharmacies, medicines, loading } = useData();
  const { getDistanceFromUser, cityName } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);

  // Find target pharmacy
  const pharmacy = useMemo(() => {
    return pharmacies.find((p) => p.id === id || p.ownerId === id) || null;
  }, [pharmacies, id]);

  // Distance to this pharmacy
  const distance = useMemo(() => {
    if (!pharmacy || !pharmacy.latitude || !pharmacy.longitude) return null;
    return getDistanceFromUser(pharmacy.latitude, pharmacy.longitude);
  }, [pharmacy, getDistanceFromUser]);

  // Medicines offered by this pharmacy
  const pharmacyMedicines = useMemo(() => {
    if (!pharmacy) return [];
    return medicines.filter((m) => m.pharmacyId === pharmacy.id || m.ownerId === pharmacy.ownerId);
  }, [medicines, pharmacy]);

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return pharmacyMedicines.filter((m) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (m.name || '').toLowerCase().includes(q);
        const matchesGeneric = (m.genericName || '').toLowerCase().includes(q);
        const matchesBrand = (m.brand || '').toLowerCase().includes(q);
        if (!matchesName && !matchesGeneric && !matchesBrand) return false;
      }
      if (selectedCategory !== 'All' && m.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [pharmacyMedicines, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500">Loading pharmacy details & live stock...</p>
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <EmptyState
          icon={Building}
          title="Pharmacy Not Found"
          description="The pharmacy requested could not be located in our verified directory."
          actionLabel="Browse All Pharmacies"
          onAction={() => window.location.href = '/pharmacies'}
        />
      </div>
    );
  }

  const mapsUrl = getGoogleMapsDirectionsUrl(pharmacy.latitude, pharmacy.longitude, pharmacy.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <Link
        to="/search"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Search
      </Link>

      {/* Header Banner & Pharmacy Info */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Banner image */}
        <div className="relative h-60 sm:h-72 w-full bg-slate-900">
          <img
            src={pharmacy.image || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=1200&q=80'}
            alt={pharmacy.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow">
              <ShieldCheck className="w-4 h-4" />
              Verified Licensed Pharmacy
            </span>
            {pharmacy.licenseNumber && (
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-slate-200 text-xs font-medium">
                Lic: {pharmacy.licenseNumber}
              </span>
            )}
          </div>

          {/* Distance pill on top right */}
          {distance !== null && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-brand-900 text-xs font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-brand-600" />
              {formatDistance(distance)} from {cityName}
            </div>
          )}

          {/* Pharmacy Name & Tagline */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
              {pharmacy.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 mt-1 max-w-2xl drop-shadow-sm">
              {pharmacy.tagline}
            </p>
          </div>
        </div>

        {/* Detailed info grid & CTAs */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="md:col-span-2 space-y-3 text-xs sm:text-sm text-slate-600">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Address</span>
                <span>{pharmacy.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Operating Hours</span>
                <span>{pharmacy.openingHours}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Phone Desk</span>
                <a href={`tel:${pharmacy.phone}`} className="text-brand-600 font-semibold hover:underline">
                  {pharmacy.phone}
                </a>
              </div>
            </div>

            {/* Facilities badges */}
            {pharmacy.facilities && (
              <div className="pt-2 flex flex-wrap gap-2">
                {pharmacy.facilities.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setDirectionsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/20 transition"
            >
              <Navigation className="w-4 h-4" />
              Get Driving Directions
            </button>

            <a
              href={`tel:${pharmacy.phone}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition"
            >
              <Phone className="w-4 h-4" />
              Call Pharmacy ({pharmacy.phone})
            </a>
          </div>

        </div>
      </div>

      {/* Available Medicines at this Pharmacy */}
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Medicines in Stock ({pharmacyMedicines.length})
            </h2>
            <p className="text-xs text-slate-500">
              Live inventory verified directly by {pharmacy.name}
            </p>
          </div>

          {/* Search within pharmacy */}
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search this pharmacy's medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 w-56 sm:w-72"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:border-brand-500"
            >
              {MEDICINE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Medicines Grid */}
        {filteredMedicines.length === 0 ? (
          <EmptyState
            icon={Pill}
            title="No matching medicines at this pharmacy"
            description="Try clearing your search query or choosing another category."
            actionLabel="View all medicines here"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMedicines.map((med) => (
              <div
                key={med.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-3">
                    <img
                      src={med.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80'}
                      alt={med.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                        {med.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{med.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{med.genericName}</p>
                      <p className="text-[11px] text-slate-400 truncate">Brand: {med.brand}</p>
                    </div>
                  </div>

                  {med.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mt-3 bg-slate-50/60 p-2 rounded-lg">
                      {med.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-slate-900 block">
                      {formatCurrency(med.price)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Updated {formatRelativeTime(med.updatedAt)}
                    </span>
                  </div>
                  <StockBadge quantity={med.quantity} />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <DirectionsModal
        isOpen={directionsModalOpen}
        onClose={() => setDirectionsModalOpen(false)}
        pharmacy={pharmacy}
        distance={distance}
      />
    </div>
  );
}
