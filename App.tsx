import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
} from '@react-native-firebase/auth';
import { configureGoogleSignIn } from './src/services/authService';
import { upsertCurrentUser } from './src/services/userService';
import { startPresence } from './src/services/presenceService';
import RootNavigator from './src/navigation/RootNavigator';
import LoginScreen from './src/screens/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    configureGoogleSignIn();

    const unsubscribe = onAuthStateChanged(getAuth(), async authUser => {
      setUser(authUser);

      if (authUser) {
        await upsertCurrentUser(authUser);
      }

      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    return startPresence(user.uid);
  }, [user?.uid]);

  if (initializing) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <RootNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
}