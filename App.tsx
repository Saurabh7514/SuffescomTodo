import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, Platform, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Animated from 'react-native-reanimated';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';



interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoItem = React.memo(({ item, onToggle, onDelete, onEdit }: { item: Todo; onToggle: (id: number) => void; onDelete: (id: number) => void; onEdit: (id: number) => void }) => {
  
  return (
    <Animated.View style={styles.card}>
      <TouchableOpacity 
        onPress={() => onToggle(item.id)} 
        style={styles.todoContent}>
        {/* <Text style={styles.statusIcon}>
          {item.completed ? '✅' : '⚪'}
        </Text> */}
        <Text style={styles.statusIcon}>
          {item.completed ? <Icon name="check-circle" size={22} color="#3e9220" /> : <Icon name="checkbox-blank-circle-outline" size={22} color="#333" />}
        </Text>
        <Text style={[styles.todoText, item.completed && styles.completed]}>
          {item.text}
        </Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(item.id)} style={styles.actionButton}>
          <Icon name="pencil" size={22} color="#800080" />
          {/* <Text style={styles.edit}>✏️</Text> */}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.actionButton}>
          <Icon name="delete" size={22} color="#d11414" />
          {/* <Text style={styles.delete}>🗑️</Text> */}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});




export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');

  const [deletedTodo, setDeletedTodo] = useState<Todo | null>(null);
  const [showUndo, setShowUndo] = useState<boolean>(false);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos();
    updateProgress();
  }, [todos]);

  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem('todos');
      if (savedTodos) setTodos(JSON.parse(savedTodos));
    } catch (error) {;
      console.error('ErrorLoading todos:', error);
    }
  };

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const updateProgress = () => {
    const completed = todos.filter(todo => todo.completed).length;
    setProgress(todos.length ? completed / todos.length : 0);
  };

  const addTodo = useCallback(() => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput('');
  }, [input, todos]);

  const toggleTodo = useCallback((id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  }, [todos]);


  const deleteTodo = (id: number) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    
    if (!todoToDelete) return;
      setDeletedTodo(todoToDelete);
      setShowUndo(true);
    setTodos(todos.filter(todo => todo.id !== id));
    setTimeout(() => {
      setShowUndo(false);
      setDeletedTodo(null);
    }, 5000);
  };


  const undoDelete = () => {
    if (deletedTodo) {
      setTodos(prevTodos => [...prevTodos, deletedTodo]);
      setDeletedTodo(null);
      setShowUndo(false);
    }
  };


  const editTodo = useCallback((id: number) => {
    const todo = todos.find(todo => todo.id === id);
    if (!todo) return;

    setEditText(todo.text);
    setEditTodoId(id);
    setEditModalVisible(true);
  }, [todos]);

  const saveEditTodo = () => {
    if (editTodoId !== null && editText.trim() !== '') {
      setTodos(todos.map(todo => (todo.id === editTodoId ? { ...todo, text: editText } : todo)));
      setEditModalVisible(false);
      setEditTodoId(null);
      setEditText('');
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>

      <Text style={styles.progressText}>
        Completed Todo: {(progress * 100).toFixed(0)}%
      </Text>
      <Progress.Bar progress={progress} 
        width={300}
        color="#800080"
        unfilledColor="#eeeeee"
        borderWidth={0}
        height={12} 
        animated={true}
        style={styles.progressBar} />
      
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Enter todo..."
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TodoItem item={item} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={editTodo} />
        )}
      />
      {showUndo && (
        <TouchableOpacity style={styles.undoContainer} onPress={undoDelete}>
          <Text style={styles.undoText}>Undo Delete</Text>
        </TouchableOpacity>
      )}


      {/* Modal for Editing Todo */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Todo</Text>
            <TextInput
              style={styles.modalInput}
              value={editText}
              onChangeText={setEditText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEditTodo} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  progressText: { alignSelf: "center", fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#333" },
  progressBar: { marginBottom: 20, alignSelf: "center" },
  inputContainer: { flexDirection: 'row', marginBottom: 10 },
  input: { flex: 1, borderBottomWidth: 1.2,borderBottomColor: "#800080", marginRight: 10, padding: 5 },
  addButton: { backgroundColor: '#800080', padding: 10, borderRadius: 5 },
  addText: { color: 'white', fontWeight: 'bold' },
  undoContainer: { padding: 10, backgroundColor: '#f0ad4e', borderRadius: 5, alignSelf: 'center', marginBottom: 10 },
  undoText: { color: 'white', fontWeight: 'bold' },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#eeeeee',
    borderRadius: 10,
    marginBottom: 12,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  todoText: {
    fontSize: 18,
    color: '#333',
    flexShrink: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 12,
  },
  edit: { marginRight: 10, color: 'green' },
  delete: { color: 'red' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalInput: { borderBottomWidth: 1, padding: 5 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelButton: { backgroundColor: 'grey', padding: 10, borderRadius: 5 },
  saveButton: { backgroundColor: '#800080', padding: 10, borderRadius: 5 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
