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