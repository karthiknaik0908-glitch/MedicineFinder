import React from 'react';
import { Pill, ShieldCheck, Heart, Users, Database, Navigation, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Intro */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
          <Pill className="w-3.5 h-3.5" />
          <span>Our Healthcare Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Eliminating the Prescription Scramble
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          MedicineFinder was built to solve a simple yet frustrating reality: patients and caregivers repeatedly hopping from medical shop to medical shop trying to locate essential prescriptions.
        </p>
      </div>

      {/* Problem & Solution comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-3xl p-8 space-y-4">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">The Problem</span>
          <h3 className="text-xl font-bold text-slate-900">Blind Store-to-Store Search</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            When a pharmacy doesn't stock a critical antibiotic, inhaler, or insulin pen, patients are forced to drive across town or make dozens of phone calls while anxious and in pain.
          </p>
          <ul className="space-y-2 text-xs text-rose-800">
            <li>• Lost hours driving between pharmacies</li>
            <li>• Dangerous delays in starting antibiotic courses</li>
            <li>• Lack of transparent price comparison</li>
          </ul>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-8 space-y-4">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">The MedicineFinder Solution</span>
          <h3 className="text-xl font-bold text-slate-900">Real-Time Geolocation Visibility</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            A centralized, frictionless portal where community pharmacies update their inventory in real time, and patients locate the nearest store with stock in seconds.
          </p>
          <ul className="space-y-2 text-xs text-emerald-800">
            <li>• Instant stock status: In Stock, Low Stock, or Out of Stock</li>
            <li>• Calculated physical GPS distance and Google Maps directions</li>
            <li>• Zero patient login required for open accessibility</li>
          </ul>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 text-center">Core Pillars</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-800">Verified Pharmacies Only</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every pharmacy listed is verified with official state pharmacy board credentials and licensed pharmacists.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-800">Cloud Real-Time Sync</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Powered by Google Firebase Firestore, ensuring stock count adjustments made by pharmacists reflect immediately to searchers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-800">Patient-First Privacy</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              No tracking of sensitive prescription queries, no mandatory user profiles, and no advertisement trackers.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
