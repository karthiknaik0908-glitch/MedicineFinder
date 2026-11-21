import {
  getAllPharmacies,
  getPharmacyById,
  getPharmacyByOwnerId,
  upsertPharmacy
} from '../firebase/firestore';

export const pharmacyService = {
  fetchAll: getAllPharmacies,
  fetchById: getPharmacyById,
  fetchByOwnerId: getPharmacyByOwnerId,
  savePharmacy: upsertPharmacy
};
