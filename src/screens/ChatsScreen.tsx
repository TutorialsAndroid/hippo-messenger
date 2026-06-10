import React, {
  useEffect,
  useState,
} from 'react';

import auth from '@react-native-firebase/auth';

import {
  View,
  Text,
  FlatList,
} from 'react-native';

import {
  ChatPreview,
} from '../types';

import {
  subscribeRecentChats,
} from '../services/chatService';

export default function ChatsScreen() {
  const [chats, setChats] =
    useState<ChatPreview[]>([]);

  useEffect(() => {
    const uid =
      auth().currentUser?.uid;

    if (!uid) {
      return;
    }

    return subscribeRecentChats(
      uid,
      setChats,
    );
  }, []);

  return (
    <FlatList
      data={chats}
      keyExtractor={item =>
        item.chatId
      }
      renderItem={({ item }) => (
        <View>
          <Text>
            {item.peer.name}
          </Text>

          <Text>
            {item.lastMessage
              ?.text ||
              'No messages'}
          </Text>

          {item.unreadCount >
            0 && (
            <Text>
              {
                item.unreadCount
              }
            </Text>
          )}
        </View>
      )}
    />
  );
}