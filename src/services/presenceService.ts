import {
  getDatabase,
  ref,
  onValue,
  update,
  onDisconnect,
  ServerValue,
} from '@react-native-firebase/database';

export function startPresence(uid: string) {
  const db = getDatabase();

  const connectedRef = ref(db, '.info/connected');
  const userRef = ref(db, `/users/${uid}`);

  const unsubscribe = onValue(connectedRef, snapshot => {
    if (snapshot.val() === true) {
      onDisconnect(userRef).update({
        online: false,
        lastSeen: ServerValue.TIMESTAMP,
      });

      update(userRef, {
        online: true,
        lastSeen: ServerValue.TIMESTAMP,
      });
    }
  });

  return unsubscribe;
}

export async function setCurrentUserOffline(uid: string) {
  const db = getDatabase();

  await update(ref(db, `/users/${uid}`), {
    online: false,
    lastSeen: ServerValue.TIMESTAMP,
  });
}