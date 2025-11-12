import { StyleSheet, Text, View } from 'react-native';

import { useSession } from '../../contexts/session-context';

export default function Index() {
  const { signOut } = useSession();
  return (
    <View style={styles.container}>
      <Text
        onPress={() => {
          // The guard in `RootNavigator` redirects back to the sign-in screen.
          signOut();
        }}
      >
        Abmelden
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
