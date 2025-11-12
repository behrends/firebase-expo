import { use, createContext } from 'react';

import { useStorageState } from '../hooks/useStorageState';

const AuthContext = createContext({
  signIn: () => null,
  signOut: () => null,
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

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // Perform sign-in logic here
          setSession('xxx');
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
