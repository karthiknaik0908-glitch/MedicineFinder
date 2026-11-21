
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

import { auth, isFirebaseConfigured } from './config';

const REGISTERED_USER_KEY = 'medicinefinder_mock_registered_user';
const SESSION_USER_KEY = 'medicinefinder_mock_user';

// Register pharmacy owner
export async function registerOwner(email, password, displayName) {
  if (isFirebaseConfigured && auth) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    await fbSignOut(auth);

    return userCredential;
  }

  // Local fallback registration
  const mockUser = {
    uid: 'owner-' + Date.now(),
    email,
    displayName: displayName || email.split('@')[0],
    password,
    isMock: true
  };

  return { user: mockUser };
}

// Login pharmacy owner
export async function loginOwner(email, password) {
  if (isFirebaseConfigured && auth) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  const raw = localStorage.getItem(REGISTERED_USER_KEY);

  if (!raw) {
    throw new Error('Please register your pharmacy first.');
  }

  const registeredUser = JSON.parse(raw);

  if (
    registeredUser.email !== email ||
    registeredUser.password !== password
  ) {
    throw new Error('Invalid email or password.');
  }

  const mockUser = {
    uid: registeredUser.uid,
    email: registeredUser.email,
    displayName: registeredUser.displayName,
    isMock: true
  };

  localStorage.setItem(
    SESSION_USER_KEY,
    JSON.stringify(mockUser)
  );

  window.dispatchEvent(new Event('mock_auth_changed'));

  return { user: mockUser };
}

// Logout
export async function logoutOwner() {
  if (isFirebaseConfigured && auth) {
    return await fbSignOut(auth);
  }

  // Remove only active session, preserve registered account
  localStorage.removeItem(SESSION_USER_KEY);

  window.dispatchEvent(new Event('mock_auth_changed'));
}

// Subscribe to authentication state
export function subscribeToAuthState(callback) {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, callback);
  }

  const checkLocal = () => {
    const raw = localStorage.getItem(SESSION_USER_KEY);

    if (raw) {
      try {
        callback(JSON.parse(raw));
      } catch {
        callback(null);
      }
    } else {
      callback(null);
    }
  };

  checkLocal();

  window.addEventListener('mock_auth_changed', checkLocal);

  return () => {
    window.removeEventListener('mock_auth_changed', checkLocal);
  };
}
