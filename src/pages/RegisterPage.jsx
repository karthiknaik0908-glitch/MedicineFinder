
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    pharmacyName: '',
    address: '',
    city: 'New York',
    state: 'NY',
    phone: '',
    licenseNumber: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Pharmacy License Number validation
    if (!formData.licenseNumber.trim()) {
      setError('Pharmacy License Number is required');
      return;
    }

    // Pharmacy name and address validation
    if (!formData.pharmacyName.trim() || !formData.address.trim()) {
      setError('Please provide pharmacy name and street address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(
        formData.email,
        formData.password,
        formData.ownerName,
        {
          name: formData.pharmacyName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          phone: formData.phone,
          licenseNumber: formData.licenseNumber.trim()
        }
      );

     navigate('/owner/login', {
  state: { registrationSuccess: true }
});

    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-brand-900/5">

        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
              <Pill className="w-6 h-6 transform -rotate-45" />
            </div>
            <span className="text-2xl font-black text-slate-900">
              Medicine<span className="text-brand-600">Finder</span>
            </span>
          </Link>

          <h2 className="text-xl font-extrabold text-slate-900">
            Register New Pharmacy
          </h2>

          <p className="text-xs text-slate-500">
            Join the verified MedicineFinder network and broadcast your live inventory
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Owner Account Details */}
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">
              1. Owner Account Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Pharmacist / Owner Name *
                </label>
                <input
                  type="text"
                  name="ownerName"
                  required
                  placeholder="e.g. Dr. Jane Smith, PharmD"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="owner@pharmacy.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Re-type password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

            </div>
          </div>

          {/* Pharmacy Profile */}
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">
              2. Pharmacy Profile
            </h4>

            <div className="space-y-3">

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Pharmacy Business Name *
                </label>
                <input
                  type="text"
                  name="pharmacyName"
                  required
                  placeholder="e.g. City Wellness Pharmacy"
                  value={formData.pharmacyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Store Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="e.g. 500 Lexington Ave, Suite 10"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Pharmacy Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+1 (212) 555-0100"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                  />
                </div>

              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Pharmacy License Number *
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  required
                  placeholder="Enter your Pharmacy License Number"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/20 transition disabled:opacity-50"
          >
            <span>
              {loading ? 'Creating Pharmacy Profile...' : 'Complete Registration'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/owner/login" className="text-brand-600 font-bold hover:underline">
            Sign in here
          </Link>
        </div>

      </div>
    </div>
  );
}
