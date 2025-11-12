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
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { useSession } from '../../contexts/session-context';
import { db } from '../../firebaseConfig';

export default function Index() {
  const { session } = useSession();
  const [todoText, setTodoText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [todos, setTodos] = useState(null);

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

  const handleToggleTodo = async (todoId, completed) => {
    if (!session?.uid) {
      return;
    }

    try {
      await updateDoc(
        doc(db, 'users', session.uid, 'todos', todoId),
        { completed: !completed }
      );
    } catch (error) {
      console.error('Failed to toggle todo', error);
      Alert.alert(
        'Fehler',
        'Der Status konnte nicht geändert werden. Bitte erneut versuchen.'
      );
    }
  };

  useEffect(() => {
    if (!session?.uid) {
      setTodos([]);
      return;
    }

    setTodos(null);
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
      },
      (error) => {
        console.error('Failed to load todos', error);
        setTodos([]);
      }
    );

    return unsubscribe;
  }, [session?.uid]);

  const isLoadingTodos = todos === null;

  return (
    <View style={styles.container}>
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
            <TouchableOpacity
              key={todo.id}
              style={[
                styles.todoItem,
                todo.completed && styles.todoItemCompleted,
              ]}
              onPress={() =>
                handleToggleTodo(todo.id, todo.completed)
              }
            >
              <Text
                style={[
                  styles.todoText,
                  todo.completed && styles.todoTextCompleted,
                ]}
              >
                {todo.text}
              </Text>
              <Text style={styles.todoToggle}>
                {todo.completed ? '↺' : '✓'}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 24,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },
  todoItemCompleted: {
    opacity: 0.7,
  },
  todoText: {
    color: '#111827',
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
  },
  todoToggle: {
    fontSize: 18,
    paddingHorizontal: 8,
    color: '#1f2937',
  },
});
