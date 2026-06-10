import React, { useEffect, useMemo, useState } from 'react';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../navigation/types';

import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import auth from '@react-native-firebase/auth';

import { subscribeRecentChats } from '../services/chatService';

import { ChatPreview } from '../types';

import ChatListItem from '../components/chat/ChatListItem';

import SearchBar from '../components/chat/SearchBar';

import EmptyChats from '../components/chat/EmptyChats';
import { colors } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ChatsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [chats, setChats] = useState<ChatPreview[]>([]);

  const [search, setSearch] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const uid = auth().currentUser?.uid;

    if (!uid) {
      return;
    }

    return subscribeRecentChats(uid, setChats);
  }, []);

  const filteredChats = useMemo(() => {
    return chats.filter(chat =>
      chat.peer.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [chats, search]);

  async function onRefresh() {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hippo Messenger</Text>

        <Text style={styles.subtitle}>Recent conversations</Text>
      </View>

      <SearchBar value={search} onChangeText={setSearch} />

      <FlatList
        data={filteredChats}
        keyExtractor={item => item.chatId}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <ChatListItem
            chat={item}
            onPress={() => {
              navigation.navigate('Chat', {
                peer: item.peer,
              });
            }}
          />
        )}
        ListEmptyComponent={<EmptyChats />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#FFFFFF',
  },

  title: {
    fontSize: 30,

    fontWeight: '900',

    paddingHorizontal: 16,

    paddingTop: 12,

    paddingBottom: 8,
    color: colors.text,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.muted,
  },
});
