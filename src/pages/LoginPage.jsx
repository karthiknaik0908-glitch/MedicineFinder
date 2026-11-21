
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Pill,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/owner/dashboard';
  const registrationSuccess = location.state?.registrationSuccess;

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError('Please provide both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email.trim(), password);

      navigate(from, { replace: true });

    } catch (err) {
      setError(
        err.message ||
        'Login failed. Please verify your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-brand-900/5">

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
            Pharmacy Owner Portal
          </h2>

          <p className="text-xs text-slate-500">
            Sign in to manage your live medicine inventory & pharmacy details
          </p>
        </div>

        {/* Registration Success Message */}
        {registrationSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              Registration successful! Please login with your registered email and password.
            </span>
          </div>
        )}

        {/* Login Error */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>

            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />

              <input
                type="email"
                required
                placeholder="owner@pharmacy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />

              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/20 transition disabled:opacity-50"
          >
            <span>
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </span>

            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Registration Link */}
        <div className="pt-2 text-center text-xs text-slate-500 space-y-2">

          <p>
            Don't have an owner account yet?{' '}
            <Link
              to="/owner/register"
              className="text-brand-600 font-bold hover:underline"
            >
              Register your pharmacy
            </Link>
          </p>

          <p>
            <Link
              to="/"
              className="text-slate-400 hover:text-slate-600 transition"
            >
              ← Return to Customer Search
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}
