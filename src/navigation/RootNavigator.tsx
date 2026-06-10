import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import UsersScreen from '../screens/UsersScreen';
import ChatScreen from '../screens/ChatScreen';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}
