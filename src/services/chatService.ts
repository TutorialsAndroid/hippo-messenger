import {
  getDatabase,
  ref,
  get,
  set,
  update,
  push,
  query,
  orderByChild,
  limitToLast,
  onValue,
  ServerValue,
} from '@react-native-firebase/database';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { ChatPreview, ChatRoom, HippoMessage, HippoUser } from '../types';
import { cleanMessageText, getChatId } from '../utils/chat';

export async function ensureChatRoom(
  currentUser: FirebaseAuthTypes.User,
  peer: HippoUser,
) {
  const db = getDatabase();
  const chatId = getChatId(currentUser.uid, peer.uid);
  const roomRef = ref(db, `/chatRooms/${chatId}`);
  const snapshot = await get(roomRef);

  const roomPayload = {
    chatId,

    members: {
      [currentUser.uid]: true,
      [peer.uid]: true,
    },

    memberInfo: {
      [currentUser.uid]: {
        uid: currentUser.uid,
        name: currentUser.displayName || 'Hippo User',
        email: currentUser.email || '',
        photoURL: currentUser.photoURL || null,
      },

      [peer.uid]: {
        uid: peer.uid,
        name: peer.name,
        email: peer.email,
        photoURL: peer.photoURL || null,
      },
    },

    unread: {
      [currentUser.uid]: 0,
      [peer.uid]: 0,
    },

    typing: {
      [currentUser.uid]: false,
      [peer.uid]: false,
    },

    createdAt: ServerValue.TIMESTAMP,
    updatedAt: ServerValue.TIMESTAMP,
  };

  if (!snapshot.exists()) {
    await set(roomRef, {
      ...roomPayload,
      createdAt: ServerValue.TIMESTAMP,
    });
  } else {
    await update(roomRef, {
      updatedAt: ServerValue.TIMESTAMP,
    });
  }

  return chatId;
}

export async function sendTextMessage(
  currentUser: FirebaseAuthTypes.User,
  peer: HippoUser,
  rawText: string,
) {
  const text = cleanMessageText(rawText);

  if (!text) {
    throw new Error('Message cannot be empty.');
  }

  if (text.length > 2000) {
    throw new Error('Message is too long. Maximum 2000 characters allowed.');
  }

  const db = getDatabase();
  const chatId = await ensureChatRoom(currentUser, peer);

  const messageRef = push(ref(db, `/messages/${chatId}`));

  const message = {
    id: messageRef.key,
    text,
    senderId: currentUser.uid,
    receiverId: peer.uid,
    type: 'text',
    createdAt: ServerValue.TIMESTAMP,
  };

  await set(messageRef, message);

  const roomRef = ref(db, `/chatRooms/${chatId}`);

  const roomSnapshot = await get(roomRef);

  const room = roomSnapshot.val();

  const currentUnread = room?.unread?.[peer.uid] || 0;

  await update(roomRef, {
    lastMessage: {
      text,
      senderId: currentUser.uid,
      receiverId: peer.uid,
      type: 'text',
      createdAt: ServerValue.TIMESTAMP,
    },

    updatedAt: ServerValue.TIMESTAMP,

    [`unread/${peer.uid}`]: currentUnread + 1,
  });

  // await update(ref(db, `/chatRooms/${chatId}`), {
  //   lastMessage: {
  //     text,
  //     senderId: currentUser.uid,
  //     receiverId: peer.uid,
  //     type: 'text',
  //   },
  //   updatedAt: ServerValue.TIMESTAMP,
  // });
}

export function subscribeMessages(
  chatId: string,
  callback: (messages: HippoMessage[]) => void,
) {
  const db = getDatabase();

  const messagesQuery = query(
    ref(db, `/messages/${chatId}`),
    orderByChild('createdAt'),
    limitToLast(100),
  );

  const unsubscribe = onValue(messagesQuery, snapshot => {
    const messages: HippoMessage[] = [];

    snapshot.forEach(child => {
      messages.push({
        ...(child.val() as HippoMessage),
        id: child.key || '',
      });

      return undefined;
    });

    callback(messages);
  });

  return unsubscribe;
}

export function subscribeChatRooms(
  currentUid: string,
  callback: (rooms: ChatRoom[]) => void,
) {
  const db = getDatabase();

  const unsubscribe = onValue(ref(db, 'chatRooms'), async snapshot => {
    const rooms: ChatRoom[] = [];

    const usersSnapshot = await get(ref(db, 'users'));

    snapshot.forEach(child => {
      const room = child.val() as ChatRoom;

      if (room.members?.[currentUid]) {
        Object.keys(room.memberInfo).forEach(uid => {
          const user = usersSnapshot.child(uid).val();

          if (user) {
            room.memberInfo[uid] = {
              uid: user.uid,
              name: user.name,
              email: user.email,
              photoURL: user.photoURL,
              online: user.online,
              lastSeen: user.lastSeen,
            };
          }
        });

        rooms.push(room);
      }
    });

    rooms.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    callback(rooms);
  });

  return unsubscribe;
}

export function subscribeRecentChats(
  currentUid: string,
  callback: (chats: ChatPreview[]) => void,
) {
  const db = getDatabase();

  return onValue(ref(db, '/chatRooms'), snapshot => {
    const chats: ChatPreview[] = [];

    snapshot.forEach(child => {
      const room = child.val() as ChatRoom;

      if (!room.members?.[currentUid]) {
        return;
      }

      const peer = Object.values(room.memberInfo).find(
        member => member.uid !== currentUid,
      );

      if (!peer) {
        return;
      }

      chats.push({
        chatId: room.chatId,

        peer: {
          uid: peer.uid,
          name: peer.name,
          email: peer.email,
          photoURL: peer.photoURL,
        },

        lastMessage: room.lastMessage,

        unreadCount: room.unread?.[currentUid] || 0,

        typing: room.typing?.[peer.uid] || false,

        updatedAt: room.updatedAt,
      });
    });

    chats.sort((a, b) => b.updatedAt - a.updatedAt);

    callback(chats);
  });
}

export async function setTyping(chatId: string, uid: string, typing: boolean) {
  const db = getDatabase();

  await update(ref(db, `/chatRooms/${chatId}/typing`), {
    [uid]: typing,
  });
}

export async function setTypingStatus(
  chatId: string,
  uid: string,
  isTyping: boolean,
) {
  try {
    console.log('TYPING START', isTyping);

    const db = getDatabase();

    await update(ref(db, `/chatRooms/${chatId}`), {
      [`typing/${uid}`]: isTyping,
    });

    console.log('TYPING SUCCESS');
  } catch (e) {
    console.log('TYPING ERROR', e);
    throw e;
  }
}

export function subscribeTypingStatus(
  chatId: string,
  callback: (typingUsers: Record<string, boolean>) => void,
) {
  const db = getDatabase();

  return onValue(ref(db, `/chatRooms/${chatId}/typing`), snapshot => {
    callback((snapshot.val() || {}) as Record<string, boolean>);
  });
}

export async function markChatAsRead(chatId: string, uid: string) {
  try {
    console.log('MARK READ START');

    const db = getDatabase();

    await update(ref(db, `/chatRooms/${chatId}`), {
      [`unread/${uid}`]: 0,
    });

    console.log('MARK READ SUCCESS');
  } catch (e) {
    console.log('MARK READ ERROR', e);
    throw e;
  }
}

export async function syncUserProfileToChats(
  uid: string,
  updates: {
    name?: string;
    photoURL?: string | null;
  },
) {
  const db = getDatabase();

  const snapshot = await get(ref(db, 'chatRooms'));

  if (!snapshot.exists()) {
    return;
  }

  const updatesMap: any = {};

  snapshot.forEach(child => {
    const room = child.val();

    if (room.members?.[uid]) {
      if (updates.name !== undefined) {
        updatesMap[`/chatRooms/${child.key}/memberInfo/${uid}/name`] =
          updates.name;
      }

      if (updates.photoURL !== undefined) {
        updatesMap[`/chatRooms/${child.key}/memberInfo/${uid}/photoURL`] =
          updates.photoURL;
      }
    }

    return undefined;
  });

  if (Object.keys(updatesMap).length) {
    await update(ref(db), updatesMap);
  }
}
