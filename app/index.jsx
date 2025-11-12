import { useState } from 'react';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSession } from '../contexts/session-context';

export default function SignIn() {
  const { signIn, isLoading } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mapFirebaseError = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Bitte prüfe das Format deiner E-Mail-Adresse.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'E-Mail oder Passwort ist falsch.';
      case 'auth/user-not-found':
        return 'Kein Konto mit dieser E-Mail gefunden.';
      case 'auth/too-many-requests':
        return 'Zu viele Versuche. Bitte versuche es später erneut.';
      default:
        return 'Anmeldung fehlgeschlagen. Bitte versuche es erneut.';
    }
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Bitte gib E-Mail und Passwort ein.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/');
    } catch (signinError) {
      if (signinError?.code) {
        setError(mapFirebaseError(signinError.code));
      } else {
        setError(
          'Anmeldung fehlgeschlagen. Bitte versuche es erneut.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Willkommen zurück</Text>
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
        style={[
          styles.button,
          (isSubmitting || isLoading) && styles.buttonDisabled,
        ]}
        onPress={handleSignIn}
        disabled={isSubmitting || isLoading}
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
