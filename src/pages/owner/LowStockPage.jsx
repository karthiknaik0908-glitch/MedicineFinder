import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StockBadge from '../../components/common/StockBadge';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { AlertTriangle, XCircle, Plus, CheckCircle, PackagePlus, Sparkles } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

export default function LowStockPage() {
  const { userPharmacy, currentUser } = useAuth();
  const { medicines, editMedicine } = useData();
  const [restockingId, setRestockingId] = useState(null);

  // My medicines
  const myMedicines = useMemo(() => {
    if (!userPharmacy?.id && !currentUser?.uid) return [];
    return medicines.filter(
      (m) => m.pharmacyId === userPharmacy?.id || m.ownerId === currentUser?.uid
    );
  }, [medicines, userPharmacy, currentUser]);

  // Low stock (1-10) and Out of stock (0)
  const lowStockItems = useMemo(() => {
    return myMedicines.filter((m) => {
      const qty = Number(m.quantity) || 0;
      return qty <= 10;
    }).sort((a, b) => (a.quantity || 0) - (b.quantity || 0));
  }, [myMedicines]);

  const handleRestock = async (medicineId, currentQty, addQty) => {
    setRestockingId(medicineId);
    try {
      await editMedicine(medicineId, {
        quantity: currentQty + addQty
      });
    } finally {
      setRestockingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
          <AlertTriangle className="w-4 h-4" />
          <span>Priority Replenishment Alert</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Low Stock & Depleted Inventory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Items with 10 or fewer units in stock. Quick-replenish to ensure patients find your pharmacy in active search results.
        </p>
      </div>

      {lowStockItems.length === 0 ? (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">All Stock Levels Healthy!</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Great job! None of your medicines are currently running low or out of stock. Every item has more than 10 units available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockItems.map((med) => {
            const qty = Number(med.quantity) || 0;
            const isOutOfStock = qty === 0;
            const isRestocking = restockingId === med.id;

            return (
              <div
                key={med.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition ${
                  isOutOfStock ? 'border-rose-200 ring-1 ring-rose-200/50' : 'border-amber-200'
                }`}
              >
                <div>
                  <div className="flex gap-4">
                    <img
                      src={med.image}
                      alt={med.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {med.category}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 truncate">
                            {med.name}
                          </h4>
                        </div>
                        <StockBadge quantity={qty} />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        Generic: {med.genericName}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        Brand: {med.brand} • {formatCurrency(med.price)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-600">Remaining Units:</span>
                    <span
                      className={`font-black text-sm ${
                        isOutOfStock ? 'text-rose-600' : 'text-amber-600'
                      }`}
                    >
                      {qty} units
                    </span>
                  </div>
                </div>

                {/* Restock Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Quick Replenish:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isRestocking}
                      onClick={() => handleRestock(med.id, qty, 20)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition disabled:opacity-50"
                    >
                      <PackagePlus className="w-3.5 h-3.5" />
                      +20 Units
                    </button>

                    <button
                      type="button"
                      disabled={isRestocking}
                      onClick={() => handleRestock(med.id, qty, 50)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      +50 Units
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
