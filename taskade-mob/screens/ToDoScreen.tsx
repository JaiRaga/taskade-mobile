import { useEffect, useState } from 'react';
import {
  Keyboard,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useRoute } from '@react-navigation/native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import ToDoItem from '../components/ToDoItem';

const GET_PROJECT = gql`
  query getTaskList($id: ID!) {
    getTaskList(id: $id) {
      id
      title
      createdAt
      todos {
        id
        content
        isCompleted
      }
    }
  }
`;

const CREATE_TODO = gql`
  mutation ToDo($content: String!, $taskListId: ID!) {
    createToDo(content: $content, taskListId: $taskListId) {
      id
      content
      isCompleted
      taskList {
        id
        progress
      }
    }
  }
`;

const UPDATE_TASKLIST = gql`
  mutation updateTaskList($id: ID!, $title: String!) {
    updateTaskList(id: $id, title: $title) {
      id
      title
      createdAt
      progress
      users {
        id
        name
      }
    }
  }
`;

export default function ToDoScreen() {
  const [project, setProject] = useState(null);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const route = useRoute();
  const id = route.params?.id;
  // console.log('TodoScreen', id)

  // console.log('Todo screen', project);
  // console.log('Todo screen', todos);

  // Get all todos from the backend
  const { data, error, loading, refetch } = useQuery(GET_PROJECT, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  // Creates a todo
  const [createToDo, { data: createToDoData, error: createToDoError }] =
    useMutation(CREATE_TODO, { refetchQueries: GET_PROJECT });

  console.log('ToDoScreen', JSON.stringify(createToDoError, null, 2));

  // create new todo cell
  const createNewItem = (atIndex: number) => {
    console.log('Pressed*******************');

    createToDo({
      variables: {
        content: '',
        taskListId: id,
      },
    });

    // fetches the todos
    refetch();
  };

  // update the title of tasklist
  const [
    updateTaskList,
    { data: updateTasklistData, error: updateTasklistError },
  ] = useMutation(UPDATE_TASKLIST);

  const updateTitle = () => {
    updateTaskList({
      variables: {
        id: project!.id,
        title
      }
    })
  }

  useEffect(() => {
    if (error) {
      Alert.alert('Error fetching project', error.message);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setProject(data.getTaskList);
      setTitle(data.getTaskList.title);
      setTodos(data.getTaskList.todos);
    }
  }, [data]);

  if (!project) {
    return <ActivityIndicator color="white" />;
  }

  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 130 : 0}
      style={{ flex: 1, paddingBottom: 10 }}
    >
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.container}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor="#eee"
            onSubmitEditing={updateTitle}
            style={styles.title}
          />

          <FlatList
            data={project.todos}
            renderItem={({ item, index }) => (
              <ToDoItem todo={item} onSubmit={() => createNewItem(index + 1)} />
            )}
            style={styles.todos}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
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
