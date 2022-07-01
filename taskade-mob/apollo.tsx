import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Platform } from 'react-native';

const URI =
  Platform.OS === 'ios' ? 'https://localhost:4000/' : 'http://10.0.2.2:4000/';

export const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
  
});
