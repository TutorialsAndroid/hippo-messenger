import {
  getDatabase,
  ref,
  get,
  set,
  update,
  query,
  orderByChild,
  onValue,
  ServerValue,
} from '@react-native-firebase/database';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { HippoUser } from '../types';
import { getAuth, updateProfile } from '@react-native-firebase/auth';

export async function upsertCurrentUser(user: FirebaseAuthTypes.User) {
  const db = getDatabase();
  const userRef = ref(db, `/users/${user.uid}`);
  const snapshot = await get(userRef);

  const baseUser: Partial<HippoUser> = {
    uid: user.uid,
    name: user.displayName || 'Hippo User',
    email: user.email || '',
    photoURL: user.photoURL || null,
    online: true,
    lastSeen: ServerValue.TIMESTAMP as unknown as number,
    updatedAt: ServerValue.TIMESTAMP as unknown as number,
  };

  if (!snapshot.exists()) {
    await set(userRef, {
      ...baseUser,
      createdAt: ServerValue.TIMESTAMP,
    });
  } else {
    await update(userRef, baseUser);
  }
}

export function subscribeUsers(
  currentUid: string,
  callback: (users: HippoUser[]) => void,
) {
  const db = getDatabase();
  const usersQuery = query(ref(db, '/users'), orderByChild('name'));

  const unsubscribe = onValue(usersQuery, snapshot => {
    const users: HippoUser[] = [];

    snapshot.forEach(child => {
      const value = child.val() as HippoUser;

      if (value?.uid && value.uid !== currentUid) {
        users.push(value);
      }

      return undefined;
    });

    callback(users);
  });

  return unsubscribe;
}

export function subscribeUserProfile(
  uid: string,
  callback: (user: HippoUser | null) => void,
) {
  const db = getDatabase();

  const userRef = ref(db, `/users/${uid}`);

  const unsubscribe = onValue(userRef, snapshot => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  });

  return unsubscribe;
}

export async function updateUserProfile(
  uid: string,
  data: {
    name?: string;
    photoURL?: string | null;
  },
) {
  const db = getDatabase();

  await update(ref(db, `/users/${uid}`), {
    ...(data.name && {
      name: data.name.trim(),
    }),

    ...(data.photoURL && {
      photoURL: data.photoURL,
    }),

    updatedAt: Date.now(),
  });
}

export function subscribeUser(
  uid: string,
  callback: (user: HippoUser) => void,
) {
  const db = getDatabase();

  return onValue(ref(db, `users/${uid}`), snapshot => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
}
