import { Stack } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { useSession } from '../../contexts/session-context';

export default function AppLayout() {
  const { signOut } = useSession();

  const handleSignOut = () => {
    signOut().catch((error) => {
      console.error('Failed to sign out', error);
    });
  };

  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <Pressable
            onPress={handleSignOut}
            hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
          >
            <Text style={{ fontWeight: '600' }}>Abmelden</Text>
          </Pressable>
        ),
        title: 'Meine Todos',
      }}
    />
  );
}
