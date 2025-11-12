import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSession } from '../contexts/session-context';

const firebaseErrorMessages = {
  'auth/invalid-email':
    'Bitte prüfe das Format deiner E-Mail-Adresse.',
  'auth/invalid-credential': 'E-Mail oder Passwort ist falsch.',
  'auth/wrong-password': 'E-Mail oder Passwort ist falsch.',
  'auth/user-not-found': 'Kein Konto mit dieser E-Mail gefunden.',
  'auth/too-many-requests':
    'Zu viele Versuche. Bitte versuche es später erneut.',
};

const defaultErrorMessage =
  'Anmeldung fehlgeschlagen. Bitte versuche es erneut.';

export default function SignIn() {
  const { signIn, isLoading } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Bitte gib E-Mail und Passwort ein.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await signIn(trimmedEmail, trimmedPassword);
    } catch (signinError) {
      const message =
        firebaseErrorMessages[signinError?.code] ||
        defaultErrorMessage;
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting || isLoading;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo-App mit Firebase</Text>
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="E-Mail"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        autoCapitalize="none"
        autoComplete="password"
        placeholder="Passwort"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
        style={[styles.button, isBusy && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={isBusy}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonLabel}>Einloggen</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  error: {
    color: '#d00',
    marginBottom: 16,
    textAlign: 'center',
  },
});
