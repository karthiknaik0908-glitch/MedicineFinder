import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Phone, Mail, MapPin, ShieldCheck, Heart, AlertCircle } from 'lucide-react';
import { isFirebaseConfigured } from '../../firebase/config';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md">
                <Pill className="w-6 h-6 transform -rotate-45" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Medicine<span className="text-brand-400">Finder</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering patients with live, transparent medicine availability across verified local pharmacies. No more stressful pharmacy-to-pharmacy hopping when urgent prescriptions are needed.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 py-1.5 px-3 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Verified Community & Hospital Pharmacies</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/search" className="hover:text-brand-400 transition">
                  Search In-Stock Medicines
                </Link>
              </li>
              <li>
                <Link to="/pharmacies" className="hover:text-brand-400 transition">
                  Nearby Pharmacies
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-400 transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-400 transition">
                  Emergency Support
                </Link>
              </li>
            </ul>
          </div>

          {/* For Pharmacy Owners */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Pharmacy Owners
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/owner/login" className="hover:text-brand-400 transition">
                  Owner Portal Login
                </Link>
              </li>
              <li>
                <Link to="/owner/register" className="hover:text-brand-400 transition">
                  Register Your Pharmacy
                </Link>
              </li>
              <li>
                <Link to="/owner/dashboard" className="hover:text-brand-400 transition">
                  Real-time Stock Sync
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-400 transition">
                  Inventory Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency & Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Patient Care
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-medium">Toll-Free Pharmacy Desk</span>
                  <span>1-800-555-MEDS (24/7)</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-medium">Support & Inquiries</span>
                  <span>help@medicinefinder.org</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Medical disclaimer */}
        <div className="py-6 border-b border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Medical Notice:</strong> MedicineFinder is a discovery platform showing real-time inventory reported by registered licensed pharmacies. Prescription-only medicines (Rx) strictly require a valid doctor prescription upon dispensing. In an acute life-threatening medical emergency, please call 911 immediately.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} MedicineFinder Health Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isFirebaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              Database Engine: {isFirebaseConfigured ? 'Google Firebase Firestore' : 'Local Storage Sandbox'}
            </span>
            <span>•</span>
            <Link to="/about" className="hover:text-white transition">Privacy Policy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
