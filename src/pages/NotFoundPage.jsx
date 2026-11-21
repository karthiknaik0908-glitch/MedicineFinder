import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Pill className="w-8 h-8 transform -rotate-45" />
        </div>
        <h1 className="text-4xl font-black text-slate-900">404</h1>
        <h2 className="text-lg font-bold text-slate-800">Page Not Found</h2>
        <p className="text-xs text-slate-500">
          The page or medication directory view you requested does not exist or has been relocated.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <Search className="w-3.5 h-3.5" />
            Find Medicines
          </Link>
        </div>
      </div>
    </div>
  );
}
