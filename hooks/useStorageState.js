import { useCallback, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export async function setStorageItemAsync(key, value) {
  if (value == null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export function useStorageState(key) {
  const [state, setState] = useState([true, null]);

  useEffect(() => {
    let isMounted = true;

    SecureStore.getItemAsync(key).then((value) => {
      if (isMounted) {
        setState([false, value]);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [key]);

  const setValue = useCallback(
    (value) => {
      setState([false, value]);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
