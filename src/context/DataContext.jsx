import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getAllPharmacies,
  getAllMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  seedInitialDataToFirestore
} from '../firebase/firestore';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [pharmacies, setPharmacies] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pharmaciesData, medicinesData] = await Promise.all([
        getAllPharmacies(),
        getAllMedicines()
      ]);
      setPharmacies(pharmaciesData);
      setMedicines(medicinesData);
    } catch (err) {
      console.error('[MedicineFinder] Error fetching data:', err);
      setError(err.message || 'Failed to load medicine directory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Add medicine action
  const createMedicine = async (medicineData) => {
    const newMed = await addMedicine(medicineData);
    setMedicines((prev) => [newMed, ...prev]);
    return newMed;
  };

  // Update medicine action
  const editMedicine = async (medicineId, updates) => {
    const updated = await updateMedicine(medicineId, updates);
    setMedicines((prev) =>
      prev.map((m) => (m.id === medicineId ? { ...m, ...updated } : m))
    );
    return updated;
  };

  // Quick stock quantity update
  const quickUpdateStock = async (medicineId, newQuantity) => {
    const updated = await updateMedicine(medicineId, { quantity: Number(newQuantity) });
    setMedicines((prev) =>
      prev.map((m) => (m.id === medicineId ? { ...m, quantity: Number(newQuantity) } : m))
    );
    return updated;
  };

  // Delete medicine action
  const removeMedicine = async (medicineId) => {
    await deleteMedicine(medicineId);
    setMedicines((prev) => prev.filter((m) => m.id !== medicineId));
  };

  // Seed sample data into store
  const seedSampleData = async () => {
    setLoading(true);
    try {
      const result = await seedInitialDataToFirestore();
      await loadData();
      return result;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        pharmacies,
        medicines,
        loading,
        error,
        refreshData: loadData,
        createMedicine,
        editMedicine,
        quickUpdateStock,
        removeMedicine,
        seedSampleData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
