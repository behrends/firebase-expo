const fs = require('fs');
const path = require('path');

function loadFirebaseConfig() {
  const localConfigPath = path.resolve(
    __dirname,
    'firebase.config.json'
  );

  if (fs.existsSync(localConfigPath)) {
    const raw = fs.readFileSync(localConfigPath, 'utf8');
    return JSON.parse(raw);
  }

  const envConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

  if (Object.values(envConfig).every(Boolean)) {
    return envConfig;
  }

  throw new Error(
    'Missing Firebase config. Provide firebase.config.json or set FIREBASE_* env variables.'
  );
}

const config = {
  expo: {
    name: 'firebase-expo',
    slug: 'firebase-expo',
    scheme: 'firebase-expo',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['expo-router', 'expo-secure-store'],
    extra: {
      firebaseConfig: loadFirebaseConfig(),
    },
  },
};

module.exports = config;
