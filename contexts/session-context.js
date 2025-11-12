import { use, createContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

const AuthContext = createContext({
  signIn: async () => null,
  signOut: async () => null,
  session: null,
  isLoading: false,
});

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
  const [session, setSession] = useState(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setSession(
        user
          ? {
              uid: user.uid,
              email: user.email,
            }
          : null
      );
      setIsAuthInitialized(true);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: (email, password) =>
          signInWithEmailAndPassword(auth, email, password),
        signOut: async () => {
          await firebaseSignOut(auth);
        },
        session,
        isLoading: !isAuthInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
