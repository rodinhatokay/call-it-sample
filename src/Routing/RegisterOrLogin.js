import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginAndRegister/LoginScreen';
import RegisterScreen from '../screens/LoginAndRegister/RegisterScreen';
const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator headerMode={false}>
    <Stack.Screen name="loginScreen" component={LoginScreen} />
    <Stack.Screen name="regiserScreen" component={RegisterScreen} />
  </Stack.Navigator>
);
