import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import StockBadge from '../common/StockBadge';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Minus, Check, AlertCircle } from 'lucide-react';

export default function StockUpdateModal({ isOpen, onClose, medicine, onSave }) {
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (medicine) {
      setQuantity(medicine.quantity || 0);
      setPrice(medicine.price || 0);
      setError('');
    }
  }, [medicine, isOpen]);

  if (!medicine) return null;

  const handleAdjust = (delta) => {
    setQuantity((prev) => Math.max(0, prev + delta));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity < 0 || isNaN(quantity)) {
      setError('Quantity cannot be negative');
      return;
    }
    if (price < 0 || isNaN(price)) {
      setError('Price cannot be negative');
      return;
    }

    setSubmitting(true);
    try {
      await onSave(medicine.id, {
        quantity: parseInt(quantity, 10),
        price: parseFloat(price)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update stock');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Stock & Price Update" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Medicine summary */}
        <div className="flex gap-3 items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
          <img
            src={medicine.image}
            alt={medicine.name}
            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">{medicine.name}</h4>
            <p className="text-xs text-slate-500 truncate">{medicine.brand} • {medicine.genericName}</p>
          </div>
        </div>

        {/* Current status preview */}
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-slate-500 font-medium">New Calculated Status:</span>
          <StockBadge quantity={quantity} />
        </div>

        {/* Quantity adjustments */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Available Inventory Quantity
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAdjust(-5)}
              className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              -5
            </button>
            <button
              type="button"
              onClick={() => handleAdjust(-1)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            >
              <Minus className="w-4 h-4" />
            </button>

            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="flex-1 text-center font-bold text-lg py-2 border border-slate-300 rounded-xl focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />

            <button
              type="button"
              onClick={() => handleAdjust(1)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAdjust(10)}
              className="px-2.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-xl text-xs transition"
            >
              +10
            </button>
          </div>
        </div>

        {/* Price adjustment */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Retail Price ($ USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-semibold text-sm">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className="w-full pl-7 pr-3 py-2 text-sm font-semibold border border-slate-300 rounded-xl focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
