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
import { HippoMessage, HippoUser } from '../types';
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

  await update(ref(db, `/chatRooms/${chatId}`), {
    lastMessage: {
      text,
      senderId: currentUser.uid,
      receiverId: peer.uid,
      type: 'text',
    },
    updatedAt: ServerValue.TIMESTAMP,
  });
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