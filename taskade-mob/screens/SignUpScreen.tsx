import {
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Text, View } from '../components/Themed';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Navigation from '../navigation';

const SignUpScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation()

  const onSubmit = () => {};

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="User123"
        placeholderTextColor={'grey'}
        value={name}
        onChangeText={setName}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Test123@test.com"
        placeholderTextColor={'grey'}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
      />
      <TextInput
        placeholder="password"
        placeholderTextColor={'grey'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.textInput}
      />
      <Pressable style={styles.signInBtn} onPress={onSubmit}>
        <Text style={styles.btnFont}>Sign Up</Text>
      </Pressable>

      <Pressable style={styles.signUpFooter} onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.btnFontFooter}>Already have an account? Sign in</Text>
      </Pressable>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  textInput: {
    color: 'white',
    fontSize: 18,
    width: '100%',
    marginVertical: 25,
  },
  signInBtn: {
    backgroundColor: '#CD113B',
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
  btnFont: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  signUpFooter: {
    marginTop: 40,
    alignItems: 'center'
  },
  btnFontFooter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#CD113B"
  }
});
