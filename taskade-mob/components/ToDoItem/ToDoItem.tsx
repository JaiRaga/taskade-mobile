import { View, Text, TextInput } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useMutation, gql } from '@apollo/client';
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

const UPDATE_TODO = gql`
  mutation UpdateTodo($isCompleted: Boolean, $content: String, $id: ID!) {
    updateToDo(id: $id, content: $content, isCompleted: $isCompleted) {
      id
      content
      isCompleted
      taskList {
        title
      }
    }
  }
`;

const ToDoItem = ({ todo, onSubmit }: ToDoItemProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [content, setContent] = useState('');

  const [updateToDo] = useMutation(UPDATE_TODO);

  const input = useRef<any>();

  const callUpdateToDo = () => {
    updateToDo({
      variables: {
        id: todo.id,
        content,
        isCompleted: isChecked,
      },
    });
  };

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
    if (nativeEvent.key === 'Backspace' && content === '') {
      // Delete item
      console.warn('delete item');
    }
  };

  return (
    <View style={styles.todoContainer}>
      {/* Checkbox */}
      <Checkbox
        isChecked={isChecked}
        onPress={() => {
          setIsChecked(!isChecked);
          callUpdateToDo();
        }}
      />

      {/* Text input */}
      <TextInput
        ref={input}
        style={styles.textInput}
        value={content}
        onChangeText={setContent}
        multiline
        onEndEditing={callUpdateToDo}
        onSubmitEditing={onSubmit}
        blurOnSubmit
        onKeyPress={onKeyPress}
      />
    </View>
  );
};

export default ToDoItem;
