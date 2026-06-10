import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';

import { ChatRoom } from '../types';
import { subscribeChatRooms } from '../services/chatService';

export default function ChatsScreen() {
  const [rooms, setRooms] =
    useState<ChatRoom[]>([]);

  useEffect(() => {
    const uid = auth().currentUser?.uid;

    if (!uid) {
      return;
    }

    const unsubscribe =
      subscribeChatRooms(uid, setRooms);

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>

      <FlatList
        data={rooms}
        keyExtractor={item => item.chatId}
        renderItem={({ item }) => (
          <View style={styles.chatItem}>
            <Text>
              {Object.values(
                item.memberInfo,
              )
                .map(m => m.name)
                .join(', ')}
            </Text>

            <Text>
              {item.lastMessage?.text ||
                'No messages'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    margin: 20,
  },

  chatItem: {
    padding: 20,
    borderBottomWidth: 1,
  },
});