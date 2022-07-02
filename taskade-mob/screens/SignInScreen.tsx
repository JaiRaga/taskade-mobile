import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Text, View } from '../components/Themed';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { gql, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from '../navigation';

const SIGN_IN_MUTATION = gql`
  mutation getUser($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const [signIn, { data, error, loading }] = useMutation(SIGN_IN_MUTATION);

  useEffect(() => {
    // if error is true
    if (error) {
      Alert.alert('Invalid Credentials. Try again.');
    }
  }, [error]);

  // if we receive signup object as response
  if (data) {
    // Save token
    AsyncStorage.setItem('token', data.signIn.token).then(() => {
      // redirect home
      navigation.navigate('Home');
    });
  }

  // console.log('Sign In Screen', data, error, loading);

  const onSubmit = () => {
    signIn({ variables: { email, password } });
  };

  return (
    <View style={styles.container}>
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
      <Pressable style={styles.signInBtn} onPress={onSubmit} disabled={loading}>
        {loading && <ActivityIndicator color={'white'} />}
        {!loading && <Text style={styles.btnFont}>Sign In</Text>}
      </Pressable>

      <Pressable
        style={styles.signUpFooter}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.btnFontFooter}>Don't have an account? Sign Up</Text>
      </Pressable>
    </View>
  );
};

export default SignInScreen;

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
    marginTop: 30,
  },
  btnFont: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpFooter: {
    marginTop: 40,
    alignItems: 'center',
  },
  btnFontFooter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#CD113B',
  },
});
