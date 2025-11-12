import { use, createContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useStorageState } from '../hooks/useStorageState';

const AuthContext = createContext({
  signIn: async () => null,
  signOut: async () => null,
  session: null,
  isLoading: false,
});

function parseSession(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Failed to parse stored session', error);
    return null;
  }
}

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error(
      'useSession must be wrapped in a <SessionProvider />'
    );
  }

  return value;
}

export function SessionProvider({ children }) {
  const [[isLoading, session], setSession] =
    useStorageState('session');
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setSession(
        user
          ? JSON.stringify({
              uid: user.uid,
              email: user.email,
            })
          : null
      );
      setIsAuthInitialized(true);
    });
  }, [setSession]);

  const parsedSession = parseSession(session);

  return (
    <AuthContext.Provider
      value={{
        signIn: (email, password) =>
          signInWithEmailAndPassword(auth, email, password),
        signOut: async () => {
          await firebaseSignOut(auth);
          setSession(null);
        },
        session: parsedSession,
        isLoading: isLoading || !isAuthInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
