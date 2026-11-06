import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBg5o_bvlELYHrYplAkAnfke1pZyxHFous',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'aperture-33819.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'aperture-33819',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'aperture-33819.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '155966723267',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:155966723267:web:1535f87857da0352387e76',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-H9BT5FL16B',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export function getFirebaseAuthInstance() {
  if (typeof window === 'undefined') {
    return { app: null, auth: null, googleProvider: null };
  }

  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    if (!auth && app) {
      auth = getAuth(app);
    }

    if (!googleProvider) {
      googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({
        prompt: 'select_account',
      });
    }

    return { app, auth, googleProvider };
  } catch (err) {
    console.warn('[Firebase] Initialization error:', err);
    return { app: null, auth: null, googleProvider: null };
  }
}
