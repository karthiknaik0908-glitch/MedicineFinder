import React, { useState } from 'react';
import { Link, useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import {
  Pill,
  MapPin,
  Menu,
  X,
  Store,
  Search,
  ShieldCheck,
  User,
  ChevronDown,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import LocationPickerModal from './LocationPickerModal';

export default function Navbar() {
  const routerLocation = useRouterLocation();
  const navigate = useNavigate();
  const { cityName, isLocating } = useLocation();
  const { currentUser, userPharmacy, logout, isFirebaseConfigured } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Find Medicines', to: '/search', icon: Search },
    { label: 'Pharmacies', to: '/pharmacies', icon: Store },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' }
  ];

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        {/* Top utility sub-bar */}
        <div className="bg-brand-900 text-brand-100 text-[11px] py-1 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Pharmacy Stock Verification active in New York Metro</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              {!isFirebaseConfigured ? (
                <span className="text-amber-300 font-medium bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  Demo Mode (Local Storage)
                </span>
              ) : (
                <span className="text-emerald-300 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Firebase Connected
                </span>
              )}
              <Link to="/about" className="hover:text-white transition">24/7 Helpline: 1-800-MED-FIND</Link>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition">
                <Pill className="w-6 h-6 transform -rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 flex items-center">
                  Medicine<span className="text-brand-600">Finder</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                  Smart Availability
                </span>
              </div>
            </Link>

            {/* Location selector pill */}
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="hidden md:flex items-center gap-2 py-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-medium text-slate-700 transition"
              title="Change search location or use GPS"
            >
              <MapPin className={`w-3.5 h-3.5 text-brand-600 ${isLocating ? 'animate-bounce' : ''}`} />
              <span className="max-w-[140px] truncate">{cityName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive = routerLocation.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side: Owner Portal / CTA */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                /* Authenticated Owner Dropdown */
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'O'}
                    </div>
                    <div className="hidden sm:block text-left text-xs">
                      <p className="font-semibold text-slate-800 leading-tight">
                        {userPharmacy?.name || currentUser.displayName || 'Owner'}
                      </p>
                      <span className="text-[10px] text-emerald-600 font-medium">Dashboard Active</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {currentUser.displayName || 'Pharmacy Owner'}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      </div>

                      <Link
                        to="/owner/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                        Owner Dashboard
                      </Link>

                      <Link
                        to="/owner/manage-medicines"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition"
                      >
                        <Pill className="w-4 h-4 text-brand-600" />
                        Manage Inventory
                      </Link>

                      <Link
                        to="/owner/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition"
                      >
                        <Store className="w-4 h-4 text-brand-600" />
                        Pharmacy Settings
                      </Link>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest Owner Login Button */
                <div className="flex items-center gap-2">
                  <Link
                    to="/owner/login"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-brand-600 hover:bg-brand-50/50 transition border border-slate-200"
                  >
                    <Store className="w-4 h-4 text-brand-600" />
                    <span>Pharmacy Portal</span>
                  </Link>

                  <Link
                    to="/search"
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-600/20 transition"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Medicine</span>
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            {/* Mobile location bar */}
            <button
              type="button"
              onClick={() => {
                setLocationModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>Search Location: <strong>{cityName}</strong></span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Home
              </Link>
              {navLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              {currentUser ? (
                <Link
                  to="/owner/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 text-white font-semibold text-sm shadow-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Go to Owner Dashboard
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/owner/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Pharmacy Login
                  </Link>
                  <Link
                    to="/owner/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-600 text-white text-xs font-semibold"
                  >
                    Register Pharmacy
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </>
  );
}
