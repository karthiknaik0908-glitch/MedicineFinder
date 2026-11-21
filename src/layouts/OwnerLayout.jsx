import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import OwnerSidebar from '../components/owner/OwnerSidebar';
import OwnerNavbar from '../components/owner/OwnerNavbar';
import MedicineFormModal from '../components/owner/MedicineFormModal';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function OwnerLayout() {
  const { currentUser, userPharmacy, loading: authLoading } = useAuth();
  const { createMedicine } = useData();
  const location = useLocation();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [addMedicineModalOpen, setAddMedicineModalOpen] = useState(false);

  // Show clean spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Verifying pharmacy credentials...</p>
        </div>
      </div>
    );
  }

  // Redirect unauthorized visitors to owner login
  if (!currentUser) {
    return <Navigate to="/owner/login" state={{ from: location }} replace />;
  }

  const handleCreateMedicine = async (medicineData) => {
    await createMedicine({
      ...medicineData,
      pharmacyId: userPharmacy?.id,
      ownerId: currentUser.uid
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800">
      {/* Sidebar */}
      <OwnerSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <OwnerNavbar
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenAddMedicine={() => setAddMedicineModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Add Medicine Modal */}
      <MedicineFormModal
        isOpen={addMedicineModalOpen}
        onClose={() => setAddMedicineModalOpen(false)}
        onSubmit={handleCreateMedicine}
        pharmacyId={userPharmacy?.id}
        ownerId={currentUser?.uid}
      />
    </div>
  );
}
