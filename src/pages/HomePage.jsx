import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Pill,
  ShieldCheck,
  Navigation,
  Clock,
  ArrowRight,
  CheckCircle2,
  Store,
  Sparkles,
  Compass,
  Activity,
  HeartHandshake
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useData } from '../context/DataContext';
import { MEDICINE_CATEGORIES } from '../utils/formatters';

const POPULAR_SEARCHES = [
  'Amoxicillin',
  'Paracetamol',
  'Metformin',
  'Azithromycin',
  'Cetirizine',
  'Atorvastatin',
  'Albuterol Inhaler',
  'Ibuprofen'
];

export default function HomePage() {
  const navigate = useNavigate();
  const { cityName, isLocating, requestLocation } = useLocation();
  const { pharmacies, medicines } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      navigate('/search');
    } else {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleQuickSearch = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-slate-50 pt-12 pb-24 border-b border-slate-100">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-1/4 -translate-y-12 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200/80 text-brand-800 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Never run from pharmacy to pharmacy again</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Find Available Medicines at <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-medical-teal bg-clip-text text-transparent">
                Nearby Pharmacies in Seconds
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Search any prescription or over-the-counter medicine. See instant live stock, verified prices, distances, and directions to pharmacies near you.
            </p>
          </div>

          {/* Interactive Search Bar Box */}
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-brand-900/5 border border-slate-200 flex flex-col sm:flex-row items-center gap-2.5"
            >
              {/* Medicine input */}
              <div className="flex-1 flex items-center gap-3 px-3 w-full">
                <Search className="w-5 h-5 text-brand-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter medicine name (e.g. Amoxicillin, Paracetamol, Metformin)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Location hint */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span className="font-medium max-w-[110px] truncate">{cityName}</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/30 transition shrink-0"
              >
                <span>Check Availability</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick search tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Popular:</span>
              {POPULAR_SEARCHES.map((med) => (
                <button
                  key={med}
                  type="button"
                  onClick={() => handleQuickSearch(med)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-slate-600 hover:text-brand-700 font-medium transition"
                >
                  {med}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-brand-600">
                {pharmacies.length || 4}+
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Verified Pharmacies</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">
                {medicines.length || 15}+
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Medicines In-Stock</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-brand-600">Real-Time</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Live Stock Sync</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">100% Free</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">No Patient Login Needed</p>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How MedicineFinder Works
          </h2>
          <p className="text-slate-600 text-sm">
            Save time, fuel, and anxiety. Confirm inventory before you step out of your home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition relative">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 font-extrabold flex items-center justify-center mb-5 text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Search Any Medicine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Type the brand name or generic chemical name of your required medication. Filter by category, prescription type, or dosage.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition relative">
            <div className="w-12 h-12 rounded-xl bg-medical-lightGreen text-medical-emerald font-extrabold flex items-center justify-center mb-5 text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Check Nearby Stock</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              View registered pharmacies sorted by distance from your current location. See exact stock status (Available, Low Stock, Out of Stock) and prices.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition relative">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 font-extrabold flex items-center justify-center mb-5 text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Get Directions & Pick Up</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Call the pharmacy with one tap to confirm or hold, and launch one-click Google Maps turn-by-turn navigation directly to the storefront.
            </p>
          </div>

        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                Explore Medication Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Browse by Category
              </h2>
            </div>
            <Link
              to="/search"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View all categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {MEDICINE_CATEGORIES.filter((c) => c !== 'All').slice(0, 8).map((cat) => (
              <Link
                key={cat}
                to={`/search?category=${encodeURIComponent(cat)}`}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 group-hover:bg-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center transition mb-3">
                  <Pill className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-700 transition">
                  {cat}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">Check local pharmacy availability</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES HIGHLIGHT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Why MedicineFinder?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Designed for Patients and Caregivers Who Can't Afford to Wait
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              When a family member is ill or needs a time-critical antibiotic or inhaler, walking from pharmacy to pharmacy only to hear "we're out of stock" is heartbreaking. MedicineFinder bridges the gap between pharmacists and patients.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Precision GPS Distance</h4>
                  <p className="text-xs text-slate-500">
                    Real mathematical Haversine calculations sort results by actual physical distance from your current location.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Clear Stock Status Indicators</h4>
                  <p className="text-xs text-slate-500">
                    Know before you go: Green (In Stock &gt; 10 units), Amber (Low Stock 1–10 units), and Red (Out of Stock).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Zero Customer Login Barrier</h4>
                  <p className="text-xs text-slate-500">
                    Patients and caregivers don't need to create accounts or give up sensitive personal information just to see medicine availability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right feature card showcase */}
          <div className="bg-gradient-to-tr from-brand-600 to-brand-800 rounded-3xl p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <Store className="w-3.5 h-3.5" />
              <span>For Community & Chain Pharmacies</span>
            </div>

            <h3 className="text-2xl font-bold leading-snug">
              Are You a Pharmacy Owner or Chief Pharmacist?
            </h3>

            <p className="text-xs text-brand-100 leading-relaxed">
              List your inventory on MedicineFinder to increase foot traffic, help patients in your neighborhood find their prescriptions, and streamline your inventory tracking in real time.
            </p>

            <ul className="space-y-2 text-xs text-brand-50">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Add, edit & adjust medicine stock in seconds</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Automatic low-stock and out-of-stock alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Showcase store hours, telephone & directions</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/owner/register"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-brand-900 font-bold text-xs shadow-md hover:bg-brand-50 transition"
              >
                Register Your Pharmacy
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/owner/login"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-700/80 hover:bg-brand-700 text-white font-semibold text-xs border border-brand-500/50 transition"
              >
                Owner Login
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
