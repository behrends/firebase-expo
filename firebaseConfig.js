import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import * as SecureStore from 'expo-secure-store';

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
  persistence: getReactNativePersistence(SecureStore),
});
export { app, db, auth };
