import { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Text, View } from '../components/Themed';
import { useQuery, gql } from '@apollo/client';
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

export default function ProjectsScreen() {
  const [projects, setProjects] = useState([]);
  // console.log('Projects screen', projects);

  const { data, error, loading } = useQuery(MY_PROJECTS);
  console.log(
    'Projects screen',
    'data:',
    data,
    'error:',
    error,
    'loading:',
    loading
  );

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
});
