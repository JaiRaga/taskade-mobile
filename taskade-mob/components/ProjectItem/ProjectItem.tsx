import { Pressable } from 'react-native';
import { Text, View } from '../Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';

interface ProjectItemProps {
  project: {
    id: string;
    title: string;
    createdAt: string;
  };
}

const ProjectItem = ({ project }: ProjectItemProps) => {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate('ToDoScreen', { id: project.id });
  };

  return (
    <Pressable onPress={onPress} style={styles.innerContainer}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="file-outline" size={24} color="grey" />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.time}>{project.createdAt}</Text>
      </View>
    </Pressable>
  );
};

export default ProjectItem;
