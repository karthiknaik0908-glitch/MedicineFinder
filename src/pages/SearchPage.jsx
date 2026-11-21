import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Pill,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Navigation
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLocation } from '../context/LocationContext';
import MedicineCard from '../components/customer/MedicineCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { MEDICINE_CATEGORIES } from '../utils/formatters';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const { medicines, pharmacies, loading } = useData();
  const { coords, cityName, getDistanceFromUser } = useLocation();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  const [maxDistance, setMaxDistance] = useState('all'); // '5' | '10' | '25' | 'all'
  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'price_asc' | 'price_desc' | 'availability'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync search input if URL params change
  useEffect(() => {
    if (searchParams.get('q') !== null) {
      setSearchTerm(searchParams.get('q') || '');
    }
    if (searchParams.get('category') !== null) {
      setSelectedCategory(searchParams.get('category') || 'All');
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (searchTerm.trim()) params.q = searchTerm.trim();
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setAvailabilityFilter('all');
    setMaxDistance('all');
    setSortBy('distance');
    setSearchParams({});
  };

  // Combine medicines with their associated pharmacy and calculated distance
  const enrichedMedicines = useMemo(() => {
    const pharmacyMap = new Map();
    pharmacies.forEach((p) => pharmacyMap.set(p.id, p));

    return medicines.map((med) => {
      const pharmacy = pharmacyMap.get(med.pharmacyId) || null;
      let distance = null;
      if (pharmacy && pharmacy.latitude && pharmacy.longitude) {
        distance = getDistanceFromUser(pharmacy.latitude, pharmacy.longitude);
      }
      return {
        ...med,
        pharmacy,
        distance
      };
    });
  }, [medicines, pharmacies, getDistanceFromUser]);

  // Apply filters
  const filteredMedicines = useMemo(() => {
    return enrichedMedicines.filter((item) => {
      // 1. Text Search (Matches medicine name, generic name, brand, or manufacturer)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const nameMatch = (item.name || '').toLowerCase().includes(query);
        const genericMatch = (item.genericName || '').toLowerCase().includes(query);
        const brandMatch = (item.brand || '').toLowerCase().includes(query);
        const manufacturerMatch = (item.manufacturer || '').toLowerCase().includes(query);
        const pharmacyMatch = (item.pharmacy?.name || '').toLowerCase().includes(query);
        if (!nameMatch && !genericMatch && !brandMatch && !manufacturerMatch && !pharmacyMatch) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory && selectedCategory !== 'All') {
        if (item.category !== selectedCategory) return false;
      }

      // 3. Availability Filter
      const qty = Number(item.quantity) || 0;
      if (availabilityFilter === 'in_stock') {
        if (qty <= 10) return false;
      } else if (availabilityFilter === 'low_stock') {
        if (qty < 1 || qty > 10) return false;
      } else if (availabilityFilter === 'out_of_stock') {
        if (qty > 0) return false;
      }

      // 4. Distance Filter
      if (maxDistance !== 'all' && item.distance !== null) {
        const maxKm = parseFloat(maxDistance);
        if (item.distance > maxKm) return false;
      }

      return true;
    });
  }, [enrichedMedicines, searchTerm, selectedCategory, availabilityFilter, maxDistance]);

  // Apply sorting
  const sortedMedicines = useMemo(() => {
    const list = [...filteredMedicines];
    if (sortBy === 'distance') {
      list.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    } else if (sortBy === 'price_asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'availability') {
      // In stock (>10) first, then low stock (1-10), then out of stock (0)
      list.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
    }
    return list;
  }, [filteredMedicines, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search medicine name, generic name, brand (e.g. Amoxicillin, Dolo)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-xs transition shrink-0"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="sm:hidden flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>Filters</span>
          </button>
        </form>

        {/* Location Notice */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 gap-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>
              Searching near: <strong>{cityName}</strong>
            </span>
          </div>
          <div>
            Showing <strong>{sortedMedicines.length}</strong> available medicine records
          </div>
        </div>
      </div>

      {/* Main Layout: Filters sidebar + Results grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Desktop Filter Sidebar */}
        <div
          className={`${
            mobileFilterOpen ? 'block' : 'hidden'
          } lg:block bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-6 lg:sticky lg:top-24`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Filters</h3>
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[11px] font-semibold text-slate-400 hover:text-brand-600 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Therapeutic Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
            >
              {MEDICINE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Status Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Stock Availability
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'all', label: 'All Stock Levels' },
                { id: 'in_stock', label: 'In Stock (>10 units)', color: 'text-emerald-600' },
                { id: 'low_stock', label: 'Low Stock (1-10 units)', color: 'text-amber-600' },
                { id: 'out_of_stock', label: 'Out of Stock', color: 'text-rose-600' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer hover:bg-slate-50 transition ${
                    availabilityFilter === opt.id ? 'bg-brand-50/70 font-semibold text-brand-900' : 'text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="availability"
                    value={opt.id}
                    checked={availabilityFilter === opt.id}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Distance Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Maximum Distance
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { value: '5', label: 'Within 5 km' },
                { value: '10', label: 'Within 10 km' },
                { value: '25', label: 'Within 25 km' },
                { value: 'all', label: 'Any Distance' },
              ].map((dist) => (
                <button
                  key={dist.value}
                  type="button"
                  onClick={() => setMaxDistance(dist.value)}
                  className={`p-2 rounded-xl border text-center font-medium transition ${
                    maxDistance === dist.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {dist.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Sort Results By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
            >
              <option value="distance">Distance (Nearest First)</option>
              <option value="availability">Stock (Highest First)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-4">
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : sortedMedicines.length === 0 ? (
            <EmptyState
              icon={Pill}
              title="No medicines match your search"
              description={`We couldn't find any medicine matching "${searchTerm}" with the active filters near ${cityName}. Try broadening your distance or category.`}
              actionLabel="Clear all filters"
              onAction={handleClearFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedMedicines.map((item) => (
                <MedicineCard
                  key={`${item.pharmacyId}-${item.id}`}
                  medicine={item}
                  pharmacy={item.pharmacy}
                  distance={item.distance}
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
