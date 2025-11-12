import {
  use,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
  const [isAuthInitializing, setIsAuthInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const storedUser = JSON.stringify({
          uid: user.uid,
          email: user.email,
        });
        setSession(storedUser);
      } else {
        setSession(null);
      }

      setIsAuthInitializing(false);
    });

    return unsubscribe;
  }, [setSession]);

  const parsedSession = useMemo(() => {
    if (!session) {
      return null;
    }

    try {
      return JSON.parse(session);
    } catch (error) {
      console.warn('Failed to parse stored session', error);
      return null;
    }
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email, password) => {
          await signInWithEmailAndPassword(auth, email, password);
        },
        signOut: async () => {
          await firebaseSignOut(auth);
          setSession(null);
        },
        session: parsedSession,
        isLoading: isLoading || isAuthInitializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
