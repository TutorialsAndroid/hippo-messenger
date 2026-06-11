import { getDatabase, ref, update } from '@react-native-firebase/database';

export async function syncUserProfileToChats(
  uid: string,
  profile: {
    name: string;
    photoURL?: string | null;
  },
) {
  const db = getDatabase();

  const updates: any = {};

  const roomsSnapshot = await db.ref('chatRooms').once('value');

  roomsSnapshot.forEach(room => {
    const data = room.val();

    if (data.members?.[uid]) {
      updates[`/chatRooms/${room.key}/memberInfo/${uid}/name`] = profile.name;

      updates[`/chatRooms/${room.key}/memberInfo/${uid}/photoURL`] =
        profile.photoURL ?? null;
    }
  });

  if (Object.keys(updates).length) {
    await update(ref(db), updates);
  }
}
