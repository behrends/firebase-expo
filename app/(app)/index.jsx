import { useEffect, useState } from 'react';
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
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import { useSession } from '../../contexts/session-context';
import { db } from '../../firebaseConfig';

export default function Index() {
  const { signOut, session } = useSession();
  const [todoText, setTodoText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [todos, setTodos] = useState([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);

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

  useEffect(() => {
    if (!session?.uid) {
      setTodos([]);
      setIsLoadingTodos(false);
      return;
    }

    setIsLoadingTodos(true);
    const todosQuery = query(
      collection(db, 'users', session.uid, 'todos'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      todosQuery,
      (snapshot) => {
        const nextTodos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodos(nextTodos);
        setIsLoadingTodos(false);
      },
      (error) => {
        console.error('Failed to load todos', error);
        setIsLoadingTodos(false);
      }
    );

    return unsubscribe;
  }, [session?.uid]);

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
      <View style={styles.listContainer}>
        {isLoadingTodos ? (
          <Text>Todos werden geladen...</Text>
        ) : todos.length === 0 ? (
          <Text>Keine Todos vorhanden.</Text>
        ) : (
          todos.map((todo) => (
            <View key={todo.id} style={styles.todoItem}>
              <Text style={styles.todoText}>{todo.text}</Text>
            </View>
          ))
        )}
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
  listContainer: {
    marginTop: 16,
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
  todoItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },
  todoText: {
    color: '#111827',
  },
});
