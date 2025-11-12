import { Stack } from 'expo-router';

export default function Root() {
  return <RootNavigator />;
}
function RootNavigator() {
  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}
