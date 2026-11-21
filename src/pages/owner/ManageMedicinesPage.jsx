import React, { useMemo, useState } from 'react';
import {
  Pill,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Sliders,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StockBadge from '../../components/common/StockBadge';
import { formatCurrency, formatRelativeTime, MEDICINE_CATEGORIES } from '../../utils/formatters';
import MedicineFormModal from '../../components/owner/MedicineFormModal';
import StockUpdateModal from '../../components/owner/StockUpdateModal';
import DeleteConfirmModal from '../../components/owner/DeleteConfirmModal';
import EmptyState from '../../components/common/EmptyState';

export default function ManageMedicinesPage() {
  const { userPharmacy, currentUser } = useAuth();
  const { medicines, createMedicine, editMedicine, removeMedicine, loading } = useData();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all' | 'available' | 'low' | 'out'

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [stockModalMedicine, setStockModalMedicine] = useState(null);
  const [deleteModalMedicine, setDeleteModalMedicine] = useState(null);

  // My medicines
  const myMedicines = useMemo(() => {
    if (!userPharmacy?.id && !currentUser?.uid) return [];
    return medicines.filter(
      (m) => m.pharmacyId === userPharmacy?.id || m.ownerId === currentUser?.uid
    );
  }, [medicines, userPharmacy, currentUser]);

  // Filtered
  const filteredMedicines = useMemo(() => {
    return myMedicines.filter((m) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (m.name || '').toLowerCase().includes(q);
        const matchesGeneric = (m.genericName || '').toLowerCase().includes(q);
        const matchesBrand = (m.brand || '').toLowerCase().includes(q);
        if (!matchesName && !matchesGeneric && !matchesBrand) return false;
      }

      if (selectedCategory !== 'All' && m.category !== selectedCategory) {
        return false;
      }

      const qty = Number(m.quantity) || 0;
      if (selectedStatus === 'available' && qty <= 10) return false;
      if (selectedStatus === 'low' && (qty < 1 || qty > 10)) return false;
      if (selectedStatus === 'out' && qty !== 0) return false;

      return true;
    });
  }, [myMedicines, searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Pharmacy Medicines
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, delete, and adjust stock quantities for {userPharmacy?.name}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-brand-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by medicine, brand, or generic ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:border-brand-500 w-full md:w-56"
          >
            {MEDICINE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="available">In Stock (&gt;10)</option>
            <option value="low">Low Stock (1-10)</option>
            <option value="out">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredMedicines.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={Pill}
              title="No medicines match your filters"
              description="Adjust your search query or filters, or add a new medicine to your catalog."
              actionLabel="Add Medicine"
              onAction={() => setAddModalOpen(true)}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80">
                  <th className="py-3.5 px-4">Medicine Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Last Updated</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMedicines.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50/60 transition group">
                    {/* Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={med.image}
                          alt={med.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{med.name}</p>
                          <p className="text-[11px] text-slate-500">
                            Generic: <span className="font-medium text-slate-700">{med.genericName}</span>
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Brand: {med.brand} • {med.manufacturer}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {med.category}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                      {formatCurrency(med.price)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <StockBadge quantity={med.quantity} />
                        <p className="text-[10px] text-slate-400">{med.quantity} units available</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {med.expiryDate || 'N/A'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {formatRelativeTime(med.updatedAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setStockModalMedicine(med)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-600 transition"
                          title="Quick stock update"
                        >
                          <Sliders className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingMedicine(med)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-600 transition"
                          title="Edit full medicine info"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteModalMedicine(med)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
                          title="Delete medicine"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

      <MedicineFormModal
        isOpen={Boolean(editingMedicine)}
        onClose={() => setEditingMedicine(null)}
        initialData={editingMedicine}
        onSubmit={async (data) => {
          if (editingMedicine) {
            await editMedicine(editingMedicine.id, data);
          }
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

      <DeleteConfirmModal
        isOpen={Boolean(deleteModalMedicine)}
        onClose={() => setDeleteModalMedicine(null)}
        medicine={deleteModalMedicine}
        onConfirm={async (id) => {
          await removeMedicine(id);
        }}
      />

    </div>
  );
}
