import {
  getAllMedicines,
  getMedicinesByPharmacy,
  getMedicinesByOwner,
  addMedicine,
  updateMedicine,
  deleteMedicine
} from '../firebase/firestore';

export const medicineService = {
  fetchAll: getAllMedicines,
  fetchByPharmacy: getMedicinesByPharmacy,
  fetchByOwner: getMedicinesByOwner,
  create: addMedicine,
  update: updateMedicine,
  remove: deleteMedicine,

  /**
   * Search medicines in-memory or by query
   */
  filterMedicines: (medicines, { query = '', category = 'All', status = 'all' }) => {
    return medicines.filter((m) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        const matches =
          (m.name || '').toLowerCase().includes(q) ||
          (m.genericName || '').toLowerCase().includes(q) ||
          (m.brand || '').toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (category !== 'All' && m.category !== category) return false;
      const qty = Number(m.quantity) || 0;
      if (status === 'available' && qty <= 10) return false;
      if (status === 'low' && (qty < 1 || qty > 10)) return false;
      if (status === 'out' && qty !== 0) return false;
      return true;
    });
  }
};
