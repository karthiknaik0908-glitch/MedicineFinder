import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store, MapPin, Phone, Clock, ShieldCheck, Check, Navigation, AlertCircle } from 'lucide-react';

export default function PharmacyProfilePage() {
  const { userPharmacy, updatePharmacyDetails } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    openingHours: '',
    latitude: 40.7128,
    longitude: -74.0060,
    licenseNumber: '',
    image: '',
    facilities: []
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (userPharmacy) {
      setFormData({
        name: userPharmacy.name || '',
        tagline: userPharmacy.tagline || '',
        address: userPharmacy.address || '',
        city: userPharmacy.city || 'New York',
        state: userPharmacy.state || 'NY',
        zipCode: userPharmacy.zipCode || '10001',
        phone: userPharmacy.phone || '',
        email: userPharmacy.email || '',
        openingHours: userPharmacy.openingHours || 'Mon - Sun: 8:00 AM - 10:00 PM',
        latitude: userPharmacy.latitude || 40.7128,
        longitude: userPharmacy.longitude || -74.0060,
        licenseNumber: userPharmacy.licenseNumber || '',
        image: userPharmacy.image || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80',
        facilities: userPharmacy.facilities || ['Drive-through', 'Vaccination Center', 'Compounding Rx']
      });
    }
  }, [userPharmacy]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleFacilityToggle = (facilityName) => {
    setFormData((prev) => {
      const current = prev.facilities || [];
      if (current.includes(facilityName)) {
        return { ...prev, facilities: current.filter((f) => f !== facilityName) };
      } else {
        return { ...prev, facilities: [...current, facilityName] };
      }
    });
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6))
        }));
        setSuccessMsg('Coordinates updated from your device GPS location! Click "Save Profile Changes" to persist.');
      },
      (err) => {
        alert('Could not retrieve device location: ' + err.message);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      setErrorMsg('Pharmacy name and street address are required');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await updatePharmacyDetails({
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude)
      });
      setSuccessMsg('Pharmacy details updated successfully! Live storefront reflects the changes.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update pharmacy details');
    } finally {
      setSaving(false);
    }
  };

  const availableFacilities = [
    'Drive-through',
    'Vaccination Center',
    'Wheelchair Accessible',
    'Home Delivery',
    '24/7 Service',
    'Compounding Pharmacy',
    'Blood Pressure Check',
    'Online Refills'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Pharmacy Profile & Storefront Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your public pharmacy listing, operating hours, contact telephone, and GPS coordinates
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              1. Business Branding & Tagline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pharmacy Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tagline / Motto
                </label>
                <input
                  type="text"
                  name="tagline"
                  placeholder="e.g. 24/7 Prescription Dispensing & Emergency Medicine"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  State Board License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Physical Address & Geolocation */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              2. Store Location & GPS Coordinates (For Haversine Navigation)
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Physical Street Address *
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* GPS coordinates & auto-detect */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Precise GPS Coordinates
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Used to calculate exact driving distance and launch Google Maps routes for patients.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold border border-brand-200 transition shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Auto-Detect My GPS
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Operating Hours & Image */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              3. Operating Hours & Storefront Photo
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Operating Hours Description *
              </label>
              <input
                type="text"
                name="openingHours"
                required
                placeholder="e.g. Mon - Sat: 8:00 AM - 10:00 PM | Sun: 9:00 AM - 8:00 PM"
                value={formData.openingHours}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Storefront Image URL
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="flex-1 text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
              </div>
            </div>

            {/* Facilities Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Pharmacy Facilities & Services
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableFacilities.map((fac) => {
                  const checked = (formData.facilities || []).includes(fac);
                  return (
                    <button
                      key={fac}
                      type="button"
                      onClick={() => handleFacilityToggle(fac)}
                      className={`p-2 rounded-xl border text-left text-xs font-medium transition ${
                        checked
                          ? 'border-brand-500 bg-brand-50 text-brand-800 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {fac}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/20 transition disabled:opacity-50"
            >
              {saving ? 'Updating Storefront...' : 'Save Profile Changes'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
