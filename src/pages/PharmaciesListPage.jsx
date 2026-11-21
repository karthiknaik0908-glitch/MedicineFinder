import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { useLocation } from '../context/LocationContext';
import PharmacyCard from '../components/customer/PharmacyCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { Store, Search, MapPin, Navigation } from 'lucide-react';

export default function PharmaciesListPage() {
  const { pharmacies, medicines, loading } = useData();
  const { getDistanceFromUser, cityName, requestLocation, isLocating } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Map medicine count per pharmacy
  const medicineCountMap = useMemo(() => {
    const map = new Map();
    medicines.forEach((m) => {
      const current = map.get(m.pharmacyId) || 0;
      map.set(m.pharmacyId, current + 1);
    });
    return map;
  }, [medicines]);

  // Enrich with distance and sort
  const enrichedPharmacies = useMemo(() => {
    return pharmacies
      .map((p) => {
        const distance = p.latitude && p.longitude ? getDistanceFromUser(p.latitude, p.longitude) : null;
        const count = medicineCountMap.get(p.id) || 0;
        return {
          ...p,
          distance,
          medicinesCount: count
        };
      })
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          (p.city && p.city.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
  }, [pharmacies, medicineCountMap, getDistanceFromUser, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Verified Healthcare Partners
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Pharmacies Near You
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sorted by physical GPS distance from <strong>{cityName}</strong>
          </p>
        </div>

        {/* Search & Location actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter pharmacies by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 w-60 sm:w-72 bg-white"
            />
          </div>

          <button
            type="button"
            disabled={isLocating}
            onClick={requestLocation}
            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold hover:bg-brand-100 transition"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>Update GPS</span>
          </button>
        </div>
      </div>

      {/* Pharmacies Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : enrichedPharmacies.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No Pharmacies Found"
          description={`We couldn't find any pharmacy matching "${searchQuery}".`}
          actionLabel="Show all pharmacies"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrichedPharmacies.map((pharmacy) => (
            <PharmacyCard
              key={pharmacy.id}
              pharmacy={pharmacy}
              medicinesCount={pharmacy.medicinesCount}
              distance={pharmacy.distance}
            />
          ))}
        </div>
      )}

    </div>
  );
}
