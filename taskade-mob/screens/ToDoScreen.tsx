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
import { useQuery, gql } from '@apollo/client';
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

let id = '4';

export default function ToDoScreen() {
  const [project, setProject] = useState(null)
  const [title, setTitle] = useState('')
  const route = useRoute();

  const { data, error, loading } = useQuery(GET_PROJECT, {
    variables: { id: route.params?.id },
  });

  const createNewItem = (atIndex: number) => {
    
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Error fetching project', error.message);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setProject(data.getTaskList)
      setTitle(data.getTaskList.title)
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
