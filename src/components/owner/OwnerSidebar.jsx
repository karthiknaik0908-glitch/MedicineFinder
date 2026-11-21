import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Pill,
  PlusCircle,
  Package,
  AlertTriangle,
  Store,
  LogOut,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function OwnerSidebar({ mobileOpen, setMobileOpen }) {
  const { userPharmacy, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', to: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'Manage Medicines', to: '/owner/manage-medicines', icon: Pill },
    { label: 'Add Medicine', to: '/owner/add-medicine', icon: PlusCircle },
    { label: 'Inventory Overview', to: '/owner/inventory', icon: Package },
    { label: 'Low Stock Alerts', to: '/owner/low-stock', icon: AlertTriangle },
    { label: 'Pharmacy Profile', to: '/owner/profile', icon: Store },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800">
      
      {/* Brand logo header */}
      <div className="p-5 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md">
            <Pill className="w-5 h-5 transform -rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white leading-tight">
              Medicine<span className="text-brand-400">Finder</span>
            </span>
            <span className="text-[10px] font-semibold text-brand-300 tracking-wider uppercase">
              Owner Console
            </span>
          </div>
        </Link>
      </div>

      {/* Current Pharmacy Card summary */}
      <div className="px-4 py-3 mx-3 my-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="truncate">Licensed Pharmacy</span>
        </div>
        <p className="text-sm font-bold text-white truncate">
          {userPharmacy?.name || 'My Pharmacy'}
        </p>
        <p className="text-[11px] text-slate-400 truncate">
          {userPharmacy?.city || 'New York'}, {userPharmacy?.state || 'NY'}
        </p>
        {userPharmacy?.id && (
          <Link
            to={`/pharmacy/${userPharmacy.id}`}
            target="_blank"
            className="mt-2 text-[11px] text-brand-300 hover:text-white flex items-center gap-1 font-medium transition"
          >
            <span>View Public Listing</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between mb-3">
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">
              {currentUser?.displayName || 'Pharmacy Owner'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{currentUser?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-200 text-xs font-semibold transition border border-slate-700/60"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <div className="hidden lg:block shrink-0">
        <div className="sticky top-0 h-screen">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
