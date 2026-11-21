
import React, { createContext, useContext, useState, useEffect } from 'react';

import {
  loginOwner,
  registerOwner,
  logoutOwner,
  subscribeToAuthState
} from '../firebase/auth';

import {
  getPharmacyByOwnerId,
  upsertPharmacy
} from '../firebase/firestore';

import { isFirebaseConfigured } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userPharmacy, setUserPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load pharmacy details for authenticated owner
  const fetchOwnerPharmacy = async (user) => {
    if (!user) {
      setUserPharmacy(null);
      return;
    }

    try {
      const pharmacy = await getPharmacyByOwnerId(user.uid);
      setUserPharmacy(pharmacy || null);
    } catch (err) {
      console.error(
        '[MedicineFinder] Error loading pharmacy:',
        err
      );
      setUserPharmacy(null);
    }
  };

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      setCurrentUser(user);

      if (user) {
        await fetchOwnerPharmacy(user);
      } else {
        setUserPharmacy(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Manual owner login
  const login = async (email, password) => {
    setAuthError(null);

    try {
      const res = await loginOwner(email, password);

      await fetchOwnerPharmacy(res.user);

      return res.user;
    } catch (err) {
      setAuthError(
        err.message || 'Login failed. Please check your credentials.'
      );
      throw err;
    }
  };

  // Register pharmacy without keeping owner logged in
  const register = async (
    email,
    password,
    displayName,
    initialPharmacy = null
  ) => {
    setAuthError(null);

    try {
      const res = await registerOwner(
        email,
        password,
        displayName
      );

      const user = res.user;

      const pharmacyId =
        'pharmacy-' + user.uid.replace(/[^a-zA-Z0-9]/g, '');

      const newPharmacy = {
        id: pharmacyId,
        ownerId: user.uid,
        name:
          initialPharmacy?.name ||
          `${displayName || 'New'} Pharmacy`,
        tagline:
          initialPharmacy?.tagline ||
          'Your Reliable Health & Medicine Partner',
        address: initialPharmacy?.address || '',
        city: initialPharmacy?.city || '',
        state: initialPharmacy?.state || '',
        zipCode: initialPharmacy?.zipCode || '',
        phone: initialPharmacy?.phone || '',
        email: user.email,
        openingHours: initialPharmacy?.openingHours || '',
        isOpenNow: true,
        latitude: initialPharmacy?.latitude
          ? Number(initialPharmacy.latitude)
          : null,
        longitude: initialPharmacy?.longitude
          ? Number(initialPharmacy.longitude)
          : null,
        licenseNumber:
          initialPharmacy?.licenseNumber?.trim() || '',
        verified: false,
        rating: 0,
        reviewsCount: 0,
        image: initialPharmacy?.image || '',
        facilities: ['Prescriptions', 'OTC Medicines']
      };

      // Save pharmacy details
      await upsertPharmacy(pharmacyId, newPharmacy);

      // Save mock account details for local testing
      if (!isFirebaseConfigured) {
        localStorage.setItem(
          'medicinefinder_mock_registered_user',
          JSON.stringify(user)
        );
      }

      // Do not keep newly registered owner logged in
      await logoutOwner();

      setCurrentUser(null);
      setUserPharmacy(null);

      return user;

    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
      throw err;
    }
  };

  // Owner logout
  const logout = async () => {
    await logoutOwner();

    setCurrentUser(null);
    setUserPharmacy(null);
  };

  // Update pharmacy details
  const updatePharmacyDetails = async (updatedFields) => {
    if (!userPharmacy?.id) return;

    const updated = await upsertPharmacy(
      userPharmacy.id,
      {
        ...userPharmacy,
        ...updatedFields
      }
    );

    setUserPharmacy(updated);

    return updated;
  };

  // Refresh pharmacy details
  const refreshPharmacy = async () => {
    if (currentUser) {
      await fetchOwnerPharmacy(currentUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userPharmacy,
        loading,
        authError,
        isFirebaseConfigured,
        login,
        register,
        logout,
        updatePharmacyDetails,
        refreshPharmacy
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}
