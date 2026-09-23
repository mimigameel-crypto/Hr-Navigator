import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import defaultConfig from '../../firebase-applet-config.json';

// Immediately initialize the [DEFAULT] Firebase app upon module evaluation
// This guarantees that any Firebase library or component expecting [DEFAULT] finds it initialized.
export function ensureDefaultFirebaseApp(): FirebaseApp {
  const existing = getApps().find(a => a.name === '[DEFAULT]');
  if (existing) {
    return existing;
  }
  return initializeApp(defaultConfig);
}

// Execute on import
export const defaultApp = ensureDefaultFirebaseApp();
