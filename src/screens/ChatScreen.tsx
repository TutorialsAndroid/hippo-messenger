import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { HippoMessage } from '../types';
import { getChatId } from '../utils/chat';
import { formatLastSeen } from '../utils/time';
import { sendTextMessage, subscribeMessages } from '../services/chatService';
import Avatar from '../components/Avatar';
import ChatBubble from '../components/ChatBubble';
import EmptyState from '../components/EmptyState';
import { getDatabase, ref, update } from '@react-native-firebase/database';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({ navigation, route }: Props) {
  const { peer } = route.params;
  const currentUser = getAuth().currentUser;
  const listRef = useRef<FlatList<HippoMessage>>(null);

  const [text, setText] = useState('');
  const [messages, setMessages] = useState<HippoMessage[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }

    const chatId = getChatId(currentUser.uid, peer.uid);

    // Reset unread count when chat opens
    const roomRef = ref(getDatabase(), `/chatRooms/${chatId}`);

    update(roomRef, {
      [`unread/${currentUser.uid}`]: 0,
    }).catch(console.error);

    const unsubscribe = subscribeMessages(chatId, setMessages);

    return unsubscribe;
  }, [currentUser?.uid, peer.uid]);

  async function handleSend() {
    if (!currentUser || sending) return;

    try {
      const message = text;
      setText('');
      setSending(true);

      await sendTextMessage(currentUser, peer, message);

      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to send message.';

      Alert.alert('Message Failed', message);
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Avatar
            name={peer.name}
            photoURL={peer.photoURL}
            online={peer.online}
            size={44}
          />

          <View style={styles.headerText}>
            <Text style={styles.name} numberOfLines={1}>
              {peer.name}
            </Text>
            <Text style={styles.status} numberOfLines={1}>
              {peer.online
                ? 'Online now'
                : `Last seen ${formatLastSeen(peer.lastSeen)}`}
            </Text>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            listRef.current?.scrollToEnd({ animated: true });
          }}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              mine={item.senderId === currentUser?.uid}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title="Start the conversation"
              message={`Say hello to ${peer.name}. Your messages will sync instantly.`}
            />
          }
        />

        <View style={styles.composer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Write a message..."
            placeholderTextColor={colors.muted}
            style={styles.input}
            multiline
            maxLength={2000}
          />

          <Pressable
            onPress={handleSend}
            disabled={sending || !text.trim()}
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.pressed,
              (!text.trim() || sending) && styles.sendDisabled,
            ]}
          >
            <Text style={styles.sendText}>➤</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  keyboard: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backText: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '700',
  },
  headerText: {
    flex: 1,
    marginLeft: 11,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  status: {
    color: colors.muted,
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600',
  },
  messages: {
    paddingTop: 16,
    paddingBottom: 18,
    flexGrow: 1,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 12 : 10,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 13,
    paddingBottom: 12,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    marginLeft: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  sendDisabled: {
    opacity: 0.45,
  },
});
