import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import { Text, View } from '../components/Themed';
import { useQuery, gql, useMutation } from '@apollo/client';
import ProjectItem from '../components/ProjectItem';

const MY_PROJECTS = gql`
  query getTasks {
    myTaskLists {
      id
      title
      createdAt
    }
  }
`;

const CREATE_TASKLIST = gql`
  mutation createTask($title: String!) {
    createTaskList(title: $title) {
      id
      createdAt
      title
      progress

      users {
        id
        name
        email
        avatar
      }
    }
  }
`;

interface modalVisibleProps {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

export default function ProjectsScreen(props: modalVisibleProps) {
  const [projects, setProjects] = useState([]);
  const [tasklistTitle, setTasklistTitle] = useState('');
  // console.log('Projects screen', projects);

  const { modalVisible, setModalVisible } = props;

  const { data, error, loading, refetch } = useQuery(MY_PROJECTS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  });
  console.log(
    'Projects screen',
    'data:',
    data,
    'error:',
    error,
    'loading:',
    loading
  );

  const [createTaskList, { data: taskListData, error: taskListError }] =
    useMutation(CREATE_TASKLIST);

  // dispatch action to create new tasklist
  const onCreateTaskList = () => {
    setModalVisible(!modalVisible);
    createTaskList({
      variables: {
        title: tasklistTitle
      }
    })
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Error fetching projects', error.message);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setProjects(data.myTaskLists);
    }
  }, [data]);

  if (loading) {
    return <ActivityIndicator color="white" />;
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              value={tasklistTitle}
              onChangeText={setTasklistTitle}
              placeholder="Enter title for the tasklist"
              placeholderTextColor={'#222'}
              style={styles.titleInput}
              multiline={true}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onCreateTaskList}
            >
              <Text style={styles.textStyle}>
                {!tasklistTitle.length ? 'Close' : 'Create TaskList'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={{ padding: 10, backgroundColor: 'grey' }}
        onPress={() => refetch()}
      >
        <Text>Fetch Data</Text>
      </Pressable>
      {/* Project task list */}
      <FlatList
        data={projects}
        renderItem={({ item }) => <ProjectItem project={item} />}
        style={styles.projects}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projects: {
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#fff00',
    marginHorizontal: 10,
  },
  modalView: {
    width: '100%',
    margin: 20,
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleInput: {
    padding: 10,
    fontSize: 18,
  },
  button: {
    borderRadius: 36,
    padding: 18,
    width: '75%',
    elevation: 2,
    marginTop: 5,
  },
  buttonOpen: {
    backgroundColor: '#404040',
  },
  buttonClose: {
    backgroundColor: 'black',
  },
  textStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
