import { useEffect, useState } from 'react';

import { getAuth } from '@react-native-firebase/auth';

import { HippoUser } from '../types';

import { subscribeUserProfile } from '../services/userService';

export default function useUserProfile() {
  const [profile, setProfile] = useState<HippoUser | null>(null);

  useEffect(() => {
    const uid = getAuth().currentUser?.uid;

    if (!uid) {
      return;
    }

    const unsubscribe = subscribeUserProfile(uid, setProfile);

    return unsubscribe;
  }, []);

  return profile;
}
