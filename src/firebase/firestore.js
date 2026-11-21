import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { INITIAL_PHARMACIES, INITIAL_MEDICINES } from '../utils/seedData';

const STORAGE_KEY_PHARMACIES = 'medicinefinder_db_pharmacies';
const STORAGE_KEY_MEDICINES = 'medicinefinder_db_medicines';

// Local storage helpers for mock/offline mode
function getLocalPharmacies() {
  const data = localStorage.getItem(STORAGE_KEY_PHARMACIES);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_PHARMACIES, JSON.stringify(INITIAL_PHARMACIES));
    return INITIAL_PHARMACIES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PHARMACIES;
  }
}

function setLocalPharmacies(pharmacies) {
  localStorage.setItem(STORAGE_KEY_PHARMACIES, JSON.stringify(pharmacies));
}

function getLocalMedicines() {
  const data = localStorage.getItem(STORAGE_KEY_MEDICINES);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_MEDICINES, JSON.stringify(INITIAL_MEDICINES));
    return INITIAL_MEDICINES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_MEDICINES;
  }
}

function setLocalMedicines(medicines) {
  localStorage.setItem(STORAGE_KEY_MEDICINES, JSON.stringify(medicines));
}

// ==========================================
// PHARMACIES CRUD & QUERIES
// ==========================================

/**
 * Fetch all pharmacies
 * @returns {Promise<Array>}
 */
export async function getAllPharmacies() {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'pharmacies'));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return list.length > 0 ? list : INITIAL_PHARMACIES;
    } catch (err) {
      console.warn('[MedicineFinder] Firestore error fetching pharmacies, falling back to cached/local:', err);
      return getLocalPharmacies();
    }
  }
  return getLocalPharmacies();
}

/**
 * Get pharmacy by ID
 * @param {string} pharmacyId
 * @returns {Promise<Object|null>}
 */
export async function getPharmacyById(pharmacyId) {
  if (!pharmacyId) return null;

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'pharmacies', pharmacyId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
    } catch (err) {
      console.warn('[MedicineFinder] Firestore error getting pharmacy:', err);
    }
  }

  const list = getLocalPharmacies();
  return list.find((p) => p.id === pharmacyId || p.ownerId === pharmacyId) || null;
}

/**
 * Get pharmacy owned by specific user UID
 * @param {string} ownerId
 * @returns {Promise<Object|null>}
 */
export async function getPharmacyByOwnerId(ownerId) {
  if (!ownerId) return null;

  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'pharmacies'), where('ownerId', '==', ownerId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
    } catch (err) {
      console.warn('[MedicineFinder] Firestore error finding pharmacy by owner:', err);
    }
  }

  const list = getLocalPharmacies();
  return list.find((p) => p.ownerId === ownerId || p.id === ownerId) || null;
}

/**
 * Create or update pharmacy details
 * @param {string} pharmacyId
 * @param {Object} pharmacyData
 * @returns {Promise<Object>}
 */
export async function upsertPharmacy(pharmacyId, pharmacyData) {
  const timestamp = new Date().toISOString();
  const cleanedData = {
    ...pharmacyData,
    latitude: Number(pharmacyData.latitude) || 40.7128,
    longitude: Number(pharmacyData.longitude) || -74.0060,
    updatedAt: timestamp
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'pharmacies', pharmacyId);
      await setDoc(docRef, {
        ...cleanedData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { id: pharmacyId, ...cleanedData };
    } catch (err) {
      console.error('[MedicineFinder] Error saving pharmacy to Firestore:', err);
      throw err;
    }
  }

  // Local storage
  const list = getLocalPharmacies();
  const index = list.findIndex((p) => p.id === pharmacyId);
  if (index >= 0) {
    list[index] = { ...list[index], ...cleanedData };
  } else {
    list.push({ id: pharmacyId, ...cleanedData });
  }
  setLocalPharmacies(list);
  return { id: pharmacyId, ...cleanedData };
}

// ==========================================
// MEDICINES CRUD & QUERIES
// ==========================================

/**
 * Fetch all medicines across all pharmacies (for global search)
 * @returns {Promise<Array>}
 */
export async function getAllMedicines() {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'medicines'));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return list.length > 0 ? list : INITIAL_MEDICINES;
    } catch (err) {
      console.warn('[MedicineFinder] Firestore error fetching medicines:', err);
      return getLocalMedicines();
    }
  }
  return getLocalMedicines();
}

/**
 * Fetch medicines by Pharmacy ID
 * @param {string} pharmacyId
 * @returns {Promise<Array>}
 */
export async function getMedicinesByPharmacy(pharmacyId) {
  if (!pharmacyId) return [];

  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'medicines'), where('pharmacyId', '==', pharmacyId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn('[MedicineFinder] Firestore error getting medicines by pharmacy:', err);
    }
  }

  const list = getLocalMedicines();
  return list.filter((m) => m.pharmacyId === pharmacyId);
}

/**
 * Fetch medicines by Owner ID
 * @param {string} ownerId
 * @returns {Promise<Array>}
 */
export async function getMedicinesByOwner(ownerId) {
  if (!ownerId) return [];

  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'medicines'), where('ownerId', '==', ownerId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn('[MedicineFinder] Firestore error getting medicines by owner:', err);
    }
  }

  const list = getLocalMedicines();
  return list.filter((m) => m.ownerId === ownerId);
}

/**
 * Add a new medicine
 * @param {Object} medicineData
 * @returns {Promise<Object>}
 */
export async function addMedicine(medicineData) {
  const timestamp = new Date().toISOString();
  const quantity = Math.max(0, parseInt(medicineData.quantity, 10) || 0);
  const price = Math.max(0, parseFloat(medicineData.price) || 0);

  const payload = {
    ...medicineData,
    quantity,
    price,
    updatedAt: timestamp,
    createdAt: timestamp
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'medicines'), {
        ...payload,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...payload };
    } catch (err) {
      console.error('[MedicineFinder] Error adding medicine to Firestore:', err);
      throw err;
    }
  }

  // Local storage fallback
  const list = getLocalMedicines();
  const newMed = {
    id: 'med-' + Date.now(),
    ...payload
  };
  list.unshift(newMed);
  setLocalMedicines(list);
  return newMed;
}

/**
 * Update an existing medicine
 * @param {string} medicineId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export async function updateMedicine(medicineId, updates) {
  const timestamp = new Date().toISOString();
  const cleanedUpdates = {
    ...updates,
    updatedAt: timestamp
  };

  if (updates.quantity !== undefined) {
    cleanedUpdates.quantity = Math.max(0, parseInt(updates.quantity, 10) || 0);
  }
  if (updates.price !== undefined) {
    cleanedUpdates.price = Math.max(0, parseFloat(updates.price) || 0);
  }

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'medicines', medicineId);
      await updateDoc(docRef, {
        ...cleanedUpdates,
        updatedAt: serverTimestamp()
      });
      return { id: medicineId, ...cleanedUpdates };
    } catch (err) {
      console.error('[MedicineFinder] Error updating medicine:', err);
      throw err;
    }
  }

  // Local storage
  const list = getLocalMedicines();
  const index = list.findIndex((m) => m.id === medicineId);
  if (index >= 0) {
    list[index] = { ...list[index], ...cleanedUpdates };
    setLocalMedicines(list);
    return list[index];
  }
  throw new Error('Medicine not found');
}

/**
 * Delete a medicine
 * @param {string} medicineId
 * @returns {Promise<boolean>}
 */
export async function deleteMedicine(medicineId) {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'medicines', medicineId));
      return true;
    } catch (err) {
      console.error('[MedicineFinder] Error deleting medicine from Firestore:', err);
      throw err;
    }
  }

  const list = getLocalMedicines();
  const filtered = list.filter((m) => m.id !== medicineId);
  setLocalMedicines(filtered);
  return true;
}

/**
 * Seed initial sample pharmacies and medicines to Firestore
 * @returns {Promise<{ pharmaciesCount: number, medicinesCount: number }>}
 */
export async function seedInitialDataToFirestore() {
  if (!isFirebaseConfigured || !db) {
    // Reset local storage to initial seed
    setLocalPharmacies(INITIAL_PHARMACIES);
    setLocalMedicines(INITIAL_MEDICINES);
    return { pharmaciesCount: INITIAL_PHARMACIES.length, medicinesCount: INITIAL_MEDICINES.length };
  }

  let pharmaciesCount = 0;
  for (const p of INITIAL_PHARMACIES) {
    const pRef = doc(db, 'pharmacies', p.id);
    await setDoc(pRef, { ...p, updatedAt: serverTimestamp() }, { merge: true });
    pharmaciesCount++;
  }

  let medicinesCount = 0;
  for (const m of INITIAL_MEDICINES) {
    const mRef = doc(db, 'medicines', m.id);
    await setDoc(mRef, { ...m, updatedAt: serverTimestamp() }, { merge: true });
    medicinesCount++;
  }

  return { pharmaciesCount, medicinesCount };
}
