import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { firebase } from "@react-native-firebase/auth";
import Login from "../src/LOGIN"
import Signup from '../src/SIGNUP';
import MainScreen from '../src/MainScreen';
import RandomForestScreen from '../src/RandomForestScreen';
import ArimaScreen from '../src/ArimaScreen';
import OptionScreen from './Optionscreen';
import Sound from './sound';
import ResetPassword from './ResetPassword';
const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp();
    }
  }, [])
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='OptionScreen'>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Signup' component={Signup} />
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: true }}/>
        <Stack.Screen name="RandomForestScreen" component={RandomForestScreen} options={{ title: 'Random Forest Prediction' }}/>
        <Stack.Screen component={ArimaScreen} name="ArimaScreen" options={{ title: 'ARIMA Prediction' }}/>
        <Stack.Screen component={OptionScreen} name='OptionScreen'/>
        <Stack.Screen component={Sound} name='Sound'/>
        <Stack.Screen component={ResetPassword} name='ResetPassword'/>
      </Stack.Navigator>

    </NavigationContainer>
  )
}

export default App
