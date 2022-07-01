import { ActivityIndicator, StyleSheet } from 'react-native';
import { View, Text } from '../components/Themed';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation()
  
  useEffect(() => {
    if (isAuthenticated()) {
      navigation.navigate('Home')
    } else {
      navigation.navigate('SignIn')
    }
  }, []);

  const isAuthenticated = () => {
    return !true;
  };

  return (
    <View style={styles.container}>
      <Text>SplashScreen</Text>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
