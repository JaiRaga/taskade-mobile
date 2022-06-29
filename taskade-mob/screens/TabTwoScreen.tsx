import { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import ProjectItem from '../components/ProjectItem';
import { Text, View } from '../components/Themed';

export default function TabTwoScreen() {
  const [projects, setProjects] = useState([
    {
      id: '1',
      title: 'project 1',
      createdAt: '2d',
    },
    {
      id: '2',
      title: 'project 2',
      createdAt: '3d',
    },
    {
      id: '3',
      title: 'project 3',
      createdAt: '4d',
    },
  ]);

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
    width: "100%"
  }
});
