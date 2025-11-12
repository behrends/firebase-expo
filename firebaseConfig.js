import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const sanitizeKey = (key) => key.replace(/[^a-zA-Z0-9._-]/g, '_');

const secureStorePersistence = {
  getItem: (key) => SecureStore.getItemAsync(sanitizeKey(key)),
  setItem: (key, value) =>
    SecureStore.setItemAsync(sanitizeKey(key), value),
  removeItem: (key) => SecureStore.deleteItemAsync(sanitizeKey(key)),
};

const firebaseConfig = Constants.expoConfig?.extra?.firebaseConfig;

if (!firebaseConfig) {
  throw new Error(
    'Firebase config is missing. Ensure extra.firebaseConfig is set in app.config.js.'
  );
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(secureStorePersistence),
});
export { app, db, auth };
