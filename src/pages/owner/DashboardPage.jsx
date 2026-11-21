import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  Package,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw,
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StockBadge from '../../components/common/StockBadge';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import MedicineFormModal from '../../components/owner/MedicineFormModal';
import StockUpdateModal from '../../components/owner/StockUpdateModal';
import DeleteConfirmModal from '../../components/owner/DeleteConfirmModal';

export default function DashboardPage() {
  const { userPharmacy, currentUser } = useAuth();
  const { medicines, createMedicine, editMedicine, removeMedicine, refreshData, loading } = useData();

  // Active modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [stockModalMedicine, setStockModalMedicine] = useState(null);
  const [deleteModalMedicine, setDeleteModalMedicine] = useState(null);

  // Filter medicines owned by this pharmacy
  const myMedicines = useMemo(() => {
    if (!userPharmacy?.id && !currentUser?.uid) return [];
    return medicines.filter(
      (m) => m.pharmacyId === userPharmacy?.id || m.ownerId === currentUser?.uid
    );
  }, [medicines, userPharmacy, currentUser]);

  // Compute inventory metrics
  const stats = useMemo(() => {
    let availableCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalUnits = 0;
    let totalInventoryValue = 0;

    myMedicines.forEach((m) => {
      const qty = Number(m.quantity) || 0;
      const price = Number(m.price) || 0;
      totalUnits += qty;
      totalInventoryValue += qty * price;

      if (qty > 10) {
        availableCount++;
      } else if (qty >= 1 && qty <= 10) {
        lowStockCount++;
      } else {
        outOfStockCount++;
      }
    });

    return {
      totalMedicines: myMedicines.length,
      availableCount,
      lowStockCount,
      outOfStockCount,
      totalUnits,
      totalInventoryValue
    };
  }, [myMedicines]);

  // Recent 5 inventory updates
  const recentUpdates = useMemo(() => {
    return [...myMedicines]
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .slice(0, 5);
  }, [myMedicines]);

  return (
    <div className="space-y-8">
      
      {/* Header welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-700 via-brand-600 to-medical-teal p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-brand-900/10">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-brand-200 uppercase tracking-wider">
            Pharmacy Control Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {userPharmacy?.name || 'Pharmacy Manager'}
          </h2>
          <p className="text-xs sm:text-sm text-brand-100 max-w-xl">
            Real-time inventory sync is active. Updates made here reflect immediately to patient searches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-brand-800 text-xs sm:text-sm font-bold shadow-md hover:bg-brand-50 transition"
          >
            <Plus className="w-4 h-4" />
            Add New Medicine
          </button>
          {userPharmacy?.id && (
            <Link
              to={`/pharmacy/${userPharmacy.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-brand-800/60 hover:bg-brand-800 text-white text-xs sm:text-sm font-semibold border border-brand-400/40 transition"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Medicines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Medicines</span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{stats.totalMedicines}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Catalog items</span>
        </div>

        {/* Available Medicines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Stock</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{stats.availableCount}</p>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">&gt; 10 units available</span>
        </div>

        {/* Low Stock Medicines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Stock</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{stats.lowStockCount}</p>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">1 to 10 units left</span>
        </div>

        {/* Out of Stock Medicines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Out of Stock</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-2">{stats.outOfStockCount}</p>
          <span className="text-[11px] text-rose-700 font-medium mt-1 block">0 units available</span>
        </div>

      </div>

      {/* Secondary Metrics: Total Units & Inventory Value */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Total Inventory Quantity</span>
            <p className="text-3xl font-extrabold text-white mt-1">{stats.totalUnits} Units</p>
            <span className="text-[11px] text-brand-300">Across all catalog entries</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-brand-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Estimated Retail Inventory Value</span>
            <p className="text-3xl font-extrabold text-emerald-400 mt-1">
              {formatCurrency(stats.totalInventoryValue)}
            </p>
            <span className="text-[11px] text-slate-400">Current store inventory value</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Inventory Updates Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Inventory Updates</h3>
            <p className="text-xs text-slate-500">Latest stock changes broadcast to patients</p>
          </div>
          <Link
            to="/owner/manage-medicines"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentUpdates.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No medicines added yet. Click "Add New Medicine" above to start your inventory!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                  <th className="py-3 px-4">Medicine</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentUpdates.map((med) => (
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
                          <p className="text-[11px] text-slate-400">{med.brand} • {med.genericName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{med.category}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{formatCurrency(med.price)}</td>
                    <td className="py-3.5 px-4">
                      <StockBadge quantity={med.quantity} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatRelativeTime(med.updatedAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setStockModalMedicine(med)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-semibold transition"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <MedicineFormModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={async (data) => {
          await createMedicine({
            ...data,
            pharmacyId: userPharmacy?.id,
            ownerId: currentUser?.uid
          });
        }}
        pharmacyId={userPharmacy?.id}
        ownerId={currentUser?.uid}
      />

      <StockUpdateModal
        isOpen={Boolean(stockModalMedicine)}
        onClose={() => setStockModalMedicine(null)}
        medicine={stockModalMedicine}
        onSave={async (id, updates) => {
          await editMedicine(id, updates);
        }}
      />

    </div>
  );
}
