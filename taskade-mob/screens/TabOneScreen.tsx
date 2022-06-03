import { useState } from 'react';
import { FlatList, StyleSheet, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import ToDoItem from '../components/ToDoItem';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  let id = '4';
  const [todos, setTodos] = useState([
    { id: '1', content: 'Buy cookies', isCompleted: false },
    { id: '2', content: 'Car Wash', isCompleted: true },
    { id: '3', content: 'Pay bills', isCompleted: false },
    { id: '4', content: 'Cardio', isCompleted: true },
  ]);

  const createNewItem = (atIndex: number) => {
    const newTodos = [...todos];
    newTodos.splice(atIndex, 0, { id, content: '', isCompleted: false });
    setTodos(newTodos)
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        renderItem={({ item, index }) => (
          <ToDoItem todo={item} onSubmit={() => createNewItem(index + 1)} />
        )}
        style={styles.todos}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  todos: {
    width: '100%',
  },
});
