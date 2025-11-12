import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import * as SecureStore from 'expo-secure-store';

const sanitizeKey = (key) => key.replace(/[^a-zA-Z0-9._-]/g, '_');

const secureStorePersistence = {
  getItem: (key) => SecureStore.getItemAsync(sanitizeKey(key)),
  setItem: (key, value) =>
    SecureStore.setItemAsync(sanitizeKey(key), value),
  removeItem: (key) =>
    SecureStore.deleteItemAsync(sanitizeKey(key)),
};

const firebaseConfig = {
  apiKey: 'AIzaSyC41HJlrJlevfkq0Lqa3jv2i4ohHTUnQWw',
  authDomain: 'fb-expo-tif23.firebaseapp.com',
  projectId: 'fb-expo-tif23',
  storageBucket: 'fb-expo-tif23.firebasestorage.app',
  messagingSenderId: '747202984030',
  appId: '1:747202984030:web:73df70edeb61e853f01ccf',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(secureStorePersistence),
});
export { app, db, auth };
