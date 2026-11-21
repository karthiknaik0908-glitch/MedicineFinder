import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
          Patient & Pharmacy Assistance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact MedicineFinder Support
        </h1>
        <p className="text-sm text-slate-600">
          Have questions about listing your pharmacy or finding a specific medication? Our healthcare coordination team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact info channels */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Emergency Medicine Helpline</h3>
            <p className="text-xs text-slate-500">
              For urgent inquiries regarding pharmacy operating status or regional stock availability:
            </p>
            <p className="text-base font-bold text-brand-600">1-800-555-MEDS</p>
            <span className="text-[11px] text-emerald-600 font-semibold block">Available 24 Hours / 7 Days</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Email Coordination</h3>
            <p className="text-xs text-slate-500">
              Pharmacy partnership requests, bug reports, and provider questions:
            </p>
            <p className="text-sm font-semibold text-slate-800">support@medicinefinder.org</p>
            <p className="text-sm font-semibold text-slate-800">pharmacy-onboarding@medicinefinder.org</p>
          </div>

          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>Medical Emergency Notice</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              MedicineFinder is a search directory and cannot provide medical advice or dispatch emergency medicines. If you are experiencing a life-threatening symptom, please dial 911 immediately.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for contacting MedicineFinder. A healthcare coordination specialist will respond to {formData.email} within 2 business hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                }}
                className="px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Send us a Message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Topic / Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                  >
                    <option value="General Inquiry">General Patient Inquiry</option>
                    <option value="Pharmacy Partnership">Pharmacy Partnership & Listing</option>
                    <option value="Stock Discrepancy">Report Inventory Discrepancy</option>
                    <option value="Technical Support">Technical / Website Issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe your inquiry or question in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition"
              >
                <Send className="w-4 h-4" />
                Submit Message
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
