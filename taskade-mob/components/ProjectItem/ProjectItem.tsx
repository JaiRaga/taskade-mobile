import {Pressable} from "react-native"
import { Text, View } from '../Themed';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from './styles';

interface ProjectItemProps {
  project: {
    id: string;
    title: string;
    createdAt: string;
  };
}

const ProjectItem = ({ project }: ProjectItemProps) => {
  
  const onPress = () => {
    console.warn(`Open project: ${project.title}`)
  }
  
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
