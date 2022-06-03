import { View, Text, TextInput } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import styles from './styles';
import Checkbox from '../Checkbox';

interface ToDoItemProps {
  todo: {
    id: string;
    content: string;
    isCompleted: boolean;
  };
  onSubmit: () => void;
}

const ToDoItem = ({ todo, onSubmit }: ToDoItemProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [content, setContent] = useState('');

  const input = useRef<any>();

  useEffect(() => {
    if (!todo) return;

    setIsChecked(todo.isCompleted);
    setContent(todo.content);
  }, [todo]);

  useEffect(() => {
    // set focus on input
    if (input.current) {
      input.current.focus();
    }
  }, [input]);

  const onKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "Backspace" && content === '') {
      // Delete item
      console.warn('delete item')
    }
  };

  return (
    <View style={styles.todoContainer}>
      {/* Checkbox */}
      <Checkbox
        isChecked={isChecked}
        onPress={() => setIsChecked(!isChecked)}
      />

      {/* Text input */}
      <TextInput
        ref={input}
        style={styles.textInput}
        value={content}
        onChangeText={setContent}
        multiline
        onSubmitEditing={onSubmit}
        blurOnSubmit
        onKeyPress={onKeyPress}
      />
    </View>
  );
};

export default ToDoItem;
