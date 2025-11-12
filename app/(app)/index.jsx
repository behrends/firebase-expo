import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import { useSession } from '../../contexts/session-context';
import { db } from '../../firebaseConfig';

export default function Index() {
  const { signOut, session } = useSession();
  const [todoText, setTodoText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isAddDisabled = !todoText.trim() || isSaving || !session?.uid;

  const handleAddTodo = async () => {
    const trimmedText = todoText.trim();
    if (!trimmedText || !session?.uid) {
      return;
    }

    try {
      setIsSaving(true);
      await addDoc(collection(db, 'users', session.uid, 'todos'), {
        text: trimmedText,
        createdAt: serverTimestamp(),
        completed: false,
      });
      setTodoText('');
    } catch (error) {
      console.error('Failed to add todo', error);
      Alert.alert(
        'Fehler',
        'Das Todo konnte nicht gespeichert werden. Bitte später erneut versuchen.'
      );
    } finally {
      setIsSaving(false);
    }
  };

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
      <View style={styles.todoContainer}>
        <TextInput
          placeholder="Neues Todo"
          value={todoText}
          onChangeText={setTodoText}
          editable={!isSaving && !!session?.uid}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleAddTodo}
        />
        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleAddTodo}
          disabled={isAddDisabled}
          style={[
            styles.addButton,
            isAddDisabled && styles.addButtonDisabled,
          ]}
        >
          <Text style={styles.addButtonText}>
            {isSaving ? 'Speichern...' : 'Hinzufügen'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoContainer: {
    marginTop: 24,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  addButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#1f2937',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
