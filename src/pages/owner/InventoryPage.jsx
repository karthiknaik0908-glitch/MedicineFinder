import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StockBadge from '../../components/common/StockBadge';
import { formatCurrency, formatRelativeTime, MEDICINE_CATEGORIES } from '../../utils/formatters';
import { Package, Search, Plus, Minus, Save, Check, RefreshCw } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

export default function InventoryPage() {
  const { userPharmacy, currentUser } = useAuth();
  const { medicines, editMedicine, loading } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  // My medicines
  const myMedicines = useMemo(() => {
    if (!userPharmacy?.id && !currentUser?.uid) return [];
    return medicines.filter(
      (m) => m.pharmacyId === userPharmacy?.id || m.ownerId === currentUser?.uid
    );
  }, [medicines, userPharmacy, currentUser]);

  const filteredMedicines = useMemo(() => {
    return myMedicines.filter((m) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (m.name || '').toLowerCase().includes(q);
        const matchesGeneric = (m.genericName || '').toLowerCase().includes(q);
        if (!matchesName && !matchesGeneric) return false;
      }
      if (selectedCategory !== 'All' && m.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [myMedicines, searchQuery, selectedCategory]);

  const handleQuickQtyAdjust = async (medicine, delta) => {
    const currentQty = Number(medicine.quantity) || 0;
    const newQty = Math.max(0, currentQty + delta);
    setUpdatingId(medicine.id);
    try {
      await editMedicine(medicine.id, { quantity: newQty });
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePriceUpdate = async (medicine, newPrice) => {
    const parsed = parseFloat(newPrice);
    if (isNaN(parsed) || parsed < 0) return;
    setUpdatingId(medicine.id);
    try {
      await editMedicine(medicine.id, { price: parsed });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Live Inventory Audit & Rapid Stock Adjustments
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Perform inline stock adjustments for rapid daily auditing and dispensing reconciliations
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search medicine or active ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:border-brand-500 w-full sm:w-60"
        >
          {MEDICINE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Rapid Adjustments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredMedicines.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={Package}
              title="No inventory records found"
              description="No medicines match your current query."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Medicine Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Rapid Stock Adjusters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMedicines.map((med) => {
                  const isUpdating = updatingId === med.id;
                  return (
                    <tr key={med.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={med.image}
                            alt={med.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{med.name}</p>
                            <p className="text-[11px] text-slate-400">{med.genericName}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {med.category}
                      </td>

                      {/* Price editing */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 font-bold">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={med.price}
                            onBlur={(e) => handlePriceUpdate(med, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handlePriceUpdate(med, e.currentTarget.value);
                                e.currentTarget.blur();
                              }
                            }}
                            className="w-20 px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-500"
                          />
                        </div>
                      </td>

                      {/* Quantity display */}
                      <td className="py-3.5 px-4">
                        <span className="text-sm font-extrabold text-slate-900">
                          {med.quantity}
                        </span>{' '}
                        <span className="text-[11px] text-slate-400">units</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <StockBadge quantity={med.quantity} />
                      </td>

                      {/* Rapid Increment / Decrement buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={isUpdating || med.quantity <= 0}
                            onClick={() => handleQuickQtyAdjust(med, -5)}
                            className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] disabled:opacity-40 transition"
                            title="Decrement 5"
                          >
                            -5
                          </button>
                          <button
                            type="button"
                            disabled={isUpdating || med.quantity <= 0}
                            onClick={() => handleQuickQtyAdjust(med, -1)}
                            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition"
                            title="Decrement 1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleQuickQtyAdjust(med, 1)}
                            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition"
                            title="Increment 1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleQuickQtyAdjust(med, 10)}
                            className="px-2 py-1 rounded-md bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-[11px] disabled:opacity-40 transition"
                            title="Increment 10"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
