## Vorbemerkungen

Firebase hat einen großzügigen kostenlosen Tarif: https://firebase.google.com/pricing

Dokumentation von Expo: https://docs.expo.dev/guides/using-firebase/

Wir verwenden das Firebase JS SDK mit Firestore und Authentication.

Mit dem Firebase JS SDK ist die Dokumentation Firebase Dokumentation für das Web relevant: https://firebase.google.com/docs/web

## Firebase-Projekt einrichten

- Firebase-Projekt erstellen: https://console.firebase.google.com/

  - Gemini optional aktivieren
  - Google Analytics ggf. deaktivieren
  - Warten bis das Projekt erstellt ist
  - Im Projekt eine App hinzufügen (Web-App-Symbol: `</>`)
  - App-Nickname vergeben
  - Firebase Hosting überspringen
  - Firebase-Konfigurationsobjekt kopieren (wird später benötigt)

- Firestore-Datenbank erstellen:

  - In der Seitenleiste unter "Build" bzw. "Entwickeln" den Eintrag "Firestore Database" auswählen
  - Standardversion wählen
  - Standort in Europa auswählen
  - Produktionsmodus wählen
  - "Create" bzw. "Erstellen" klicken

- Firestore-Datenbank so einrichten, dass nur authentifizierte Benutzer lesen und schreiben können:

  - Im Tab "Rules" bzw. "Regeln" den Code anpassen:

  ```plaintext
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if request.auth != null;
      }
    }
  }
  ```

  - "Publish" bzw. "Veröffentlichen" klicken

- Authentication einrichten:

  - In der Seitenleiste unter "Build" bzw. "Entwickeln" den Eintrag "Authentication" auswählen
  - "Get started" bzw. "Los geht's" klicken
  - Unter dem Tab "Sign-in method" bzw. "Anmeldemethode" die gewünschten Anmeldemethoden aktivieren. Wir nehmen E-Mail/Passwort und aktivieren diese:
    - E-Mail/Passwort auswählen
    - "Enable" bzw. "Aktivieren" klicken
  - Speichern

## Firebase im Expo-Projekt verwenden

- Firebase im Projekt installieren:

  ```bash
  npx expo install firebase
  ```

  - (nicht mit `npm install` wie in den Firebase-Konsolen-Anweisungen beschrieben)

- Firebase im Projekt initialisieren:

  - Datei für das Firebase-Konfigurationsobjekt erstellen (z.B. `firebaseConfig.js` oder `.ts` je nach Projekt, ggf. passenden Speicherort wählen)
  - In die Datei den Code für das Firebase-Konfigurationsobjekt aus der Firebase-Konsole einfügen:

  ```js
    import { initializeApp } from 'firebase/app';

    configuration
    const firebaseConfig = {
      apiKey: // usw.
      // …
    };

    const app = initializeApp(firebaseConfig);
  ```

  - Firebase-Module importieren und verwenden, z.B. für Firestore und Authentication:

  ```js
  import app from './firebaseConfig';
  import { getAuth } from 'firebase/auth';
  import { getFirestore } from 'firebase/firestore';

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  export { app, db, auth };
  ```

- Authentication in der App verwenden mit Expo Router: https://docs.expo.dev/router/advanced/authentication/

- Lokales Storage in Firebase einrichten (in `firebaseConfig.js`):

  - `expo-secure-store` installieren (siehe https://docs.expo.dev/versions/latest/sdk/securestore/):

  ```bash
  npx expo install expo-secure-store
  ```

  ```js
  import { initializeApp } from 'firebase/app';
  import {
    initializeAuth,
    getReactNativePersistence,
  } from 'firebase/auth';
  import { getFirestore } from 'firebase/firestore';
  import * as SecureStore from 'expo-secure-store';

  const firebaseConfig = {
    apiKey: // usw.
    // …
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(SecureStore),
  });
  export { app, db, auth };
  ```
