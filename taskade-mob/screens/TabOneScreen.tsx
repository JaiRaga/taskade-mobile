import { useState } from 'react';
import {
  Keyboard,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import ToDoItem from '../components/ToDoItem';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState([
    { id: '1', content: 'Buy cookies', isCompleted: false },
    { id: '2', content: 'Car Wash', isCompleted: true },
    { id: '3', content: 'Pay bills', isCompleted: false },
    { id: '4', content: 'Cardio', isCompleted: true },
  ]);

  let id = '4';
  const createNewItem = (atIndex: number) => {
    const newTodos = [...todos];
    newTodos.splice(atIndex, 0, { id, content: '', isCompleted: false });
    setTodos(newTodos);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 130 : 0}
      style={{ flex: 1 }}
    >
      <ScrollView keyboardShouldPersistTaps="always">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              placeholderTextColor="#eee"
              style={styles.title}
            />

            <FlatList
              data={todos}
              renderItem={({ item, index }) => (
                <ToDoItem
                  todo={item}
                  onSubmit={() => createNewItem(index + 1)}
                />
              )}
              style={styles.todos}
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  title: {
    width: '100%',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  todos: {
    width: '100%',
  },
});
