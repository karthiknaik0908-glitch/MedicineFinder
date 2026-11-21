import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { DataProvider } from './context/DataContext';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import OwnerLayout from './layouts/OwnerLayout';

// Customer Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PharmaciesListPage from './pages/PharmaciesListPage';
import PharmacyDetailsPage from './pages/PharmacyDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Owner Dashboard Pages
import DashboardPage from './pages/owner/DashboardPage';
import ManageMedicinesPage from './pages/owner/ManageMedicinesPage';
import AddMedicinePage from './pages/owner/AddMedicinePage';
import InventoryPage from './pages/owner/InventoryPage';
import LowStockPage from './pages/owner/LowStockPage';
import PharmacyProfilePage from './pages/owner/PharmacyProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <DataProvider>
            <Routes>
              
              {/* Customer Website Routes */}
              <Route element={<CustomerLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/pharmacies" element={<PharmaciesListPage />} />
                <Route path="/pharmacy/:id" element={<PharmacyDetailsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/owner/login" element={<LoginPage />} />
                <Route path="/owner/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Pharmacy Owner Protected Dashboard Routes */}
              <Route path="/owner" element={<OwnerLayout />}>
                <Route index element={<Navigate to="/owner/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="manage-medicines" element={<ManageMedicinesPage />} />
                <Route path="add-medicine" element={<AddMedicinePage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="low-stock" element={<LowStockPage />} />
                <Route path="profile" element={<PharmacyProfilePage />} />
              </Route>

            </Routes>
          </DataProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
