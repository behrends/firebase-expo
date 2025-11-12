# Beispiel-App mit Expo und Firebase

Eine minimale Todo-App, die Expo Router mit Authentication Flow und Firebase (Firestore und Authentication) verwendet.

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

- Firebase im Projekt installieren (ist in diesem Projekt bereits geschehen):

  ```bash
  npx expo install firebase
  ```

  - (nicht mit `npm install` wie in den Firebase-Konsolen-Anweisungen beschrieben)

- Firebase im Projekt initialisieren:

  - Kopiere `firebase.config.example.json` zu `firebase.config.json` (steht in `.gitignore`) und trage dort die Werte aus der Firebase-Konsole ein. Diese Datei bleibt lokal und landet nicht im Repo.
  - Alternativ kannst du die Umgebungsvariablen `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID` und `FIREBASE_APP_ID` setzen (z.B. im CI oder per Shell-Export). `app.config.js` liest zuerst die JSON-Datei und fällt dann auf diese Variablen zurück.
  - `app.config.js` stellt die Werte als `extra.firebaseConfig` bereit, sodass der eigentliche App-Code keinen direkten Zugriff auf Secrets braucht.

  - Firebase-Module importieren und verwenden, z.B. für Firestore und Authentication:

  ```js
  import Constants from 'expo-constants';
  import { initializeApp } from 'firebase/app';
  import { getAuth } from 'firebase/auth';
  import { getFirestore } from 'firebase/firestore';

  const firebaseConfig =
    Constants.expoConfig?.extra?.firebaseConfig ||
    Constants.manifest?.extra?.firebaseConfig;

  if (!firebaseConfig) {
    throw new Error('Firebase config fehlt (extra.firebaseConfig).');
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  export { app, db, auth };
  ```

  - `expo-secure-store` für lokale Session-Speicherung installieren (siehe https://docs.expo.dev/versions/latest/sdk/securestore/), dies ist bereits im Projekt geschehen:

  ```bash
  npx expo install expo-secure-store
  ```

  - Wir verwenden `expo-secure-store`, um die Benutzersitzung lokal zu speichern, damit der Benutzer angemeldet bleibt, auch wenn die App geschlossen wird. Die Verwendung ist in [`firebaseConfig.js`](firebaseConfig.js) zu sehen.

- Der Authentication-Flow in der App basiert auf den Anleitungen aus der Expo-Router-Dokumentation: https://docs.expo.dev/router/advanced/authentication/
