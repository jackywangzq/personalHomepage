import React from 'react';
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../pages/Login';
import AuthLoadingScreen from '../pages/AuthLoading';

const AuthStack = createStackNavigator(
  { 
    Login: LoginScreen 
  },
  {
    headerMode: 'none',
  },
);

export default createAppContainer(createSwitchNavigator(
  {
    Main: MainTabNavigator,
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));