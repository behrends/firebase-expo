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
    - "E-Mail/Passwort" Aktivieren
    - Speichern

- In diesem Projekt haben wir (noch) keine Registrierung eingebaut. Daher einen Nutzer in der Firebase-Konsole anlegen:

  - Unter dem Tab "Users" bzw. "Nutzer" auf "Add user" bzw. "Nutzer hinzufügen" klicken
  - E-Mail und Passwort eingeben
  - "Add user" bzw. "Nutzer hinzufügen" klicken

## Projekt klonen und starten

- Repository klonen und in das Verzeichnis wechseln
- `npm install` ausführen, um Abhängigkeiten zu installieren
- Firebase-Konfiguration einrichten:

  - `firebase.config.example.json` zu `firebase.config.json` kopieren
  - Die Werte aus der Firebase-Konsole im Web-Browser in `firebase.config.json` eintragen (siehe oben):
    - Projektübersicht
    - App auswählen
    - Unter "Allgemein" die Firebase-Konfiguration finden und kopieren

- `npx expo start` ausführen, um den Expo-Entwicklungsserver zu starten
- App im Emulator, Simulator oder auf dem Gerät öffnen
- Mit dem in der Firebase-Konsole angelegten Nutzer anmelden

## Weitere Bemerkungen

Diese App wurde bewusst minimal gehalten, um den Fokus auf die Integration von Expo Router mit Firebase zu legen. Es gibt keine erweiterten Funktionen wie Passwort-Zurücksetzen, E-Mail-Verifizierung oder Nutzerprofile.

Bei Erstellung eines eigenen Projekts mit Expo ist folgendes zu beachten:

- Firebase im Projekt installieren (ist in diesem Projekt bereits geschehen):

  ```bash
  npx expo install firebase
  ```

  - (nicht mit `npm install` wie in den Firebase-Konsolen-Anweisungen beschrieben)

Wir verwenden `app.config.js`, um die Firebase-Konfiguration aus `firebase.config.json`. Dies ist ein alternativer Ansatz zu `.env`-Dateien und ermöglicht es, Secrets aus dem Quellcode fernzuhalten.

`expo-secure-store` wird eingesetzt, um die Benutzersitzung lokal zu speichern, damit der Benutzer angemeldet bleibt, auch wenn die App geschlossen wird. Die Verwendung ist in [`firebaseConfig.js`](firebaseConfig.js) zu sehen.

Der Authentication-Flow in der App basiert auf den Anleitungen aus der Expo-Router-Dokumentation: https://docs.expo.dev/router/advanced/authentication/
