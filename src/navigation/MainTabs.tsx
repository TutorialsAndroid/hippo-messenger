import React from 'react';
import { Text } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ChatsScreen from '../screens/ChatsScreen';
import UsersScreen from '../screens/UsersScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { colors } from '../constants/theme';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colors.bg,
        },

        tabBarActiveTintColor:
          colors.primary,

        tabBarInactiveTintColor:
          colors.muted,
      }}
    >
      <Tab.Screen
        name="ChatsTab"
        component={ChatsScreen}
        options={{
          title: 'Chats',

          tabBarIcon: ({ color }) => (
            <Text
              style={{
                color,
                fontSize: 20,
              }}
            >
              💬
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="UsersTab"
        component={UsersScreen}
        options={{
          title: 'Users',

          tabBarIcon: ({ color }) => (
            <Text
              style={{
                color,
                fontSize: 20,
              }}
            >
              👥
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',

          tabBarIcon: ({ color }) => (
            <Text
              style={{
                color,
                fontSize: 20,
              }}
            >
              👤
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}