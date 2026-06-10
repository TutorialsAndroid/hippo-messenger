import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Avatar from '../Avatar';
import OnlineIndicator from './OnlineIndicator';
import UnreadBadge from './UnreadBadge';

import { ChatPreview } from '../../types';
import { formatChatTime } from '../../utils/chatTime';

type Props = {
  chat: ChatPreview;
  onPress: () => void;
};

function formatTime(timestamp?: number) {
  if (!timestamp) {
    return '';
  }

  const date = new Date(timestamp);

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ChatListItem({ chat, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      {/* Avatar Section */}

      <View style={styles.avatarWrapper}>
        <Avatar name={chat.peer.name} photoURL={chat.peer.photoURL} size={58} />

        {chat.peer.online && <OnlineIndicator />}
      </View>

      {/* Middle Section */}

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text numberOfLines={1} style={styles.name}>
            {chat.peer.name}
          </Text>

          <Text style={styles.time}>
            {formatChatTime(chat.lastMessage?.createdAt)}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <Text numberOfLines={1} style={styles.message}>
            {chat.lastMessage?.text || 'Start chatting'}
          </Text>

          <UnreadBadge count={chat.unreadCount} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 16,

    paddingVertical: 12,

    backgroundColor: '#FFFFFF',
  },

  pressed: {
    opacity: 0.8,
  },

  avatarWrapper: {
    position: 'relative',
  },

  content: {
    flex: 1,

    marginLeft: 14,

    borderBottomWidth: 1,

    borderBottomColor: '#F1F5F9',

    paddingBottom: 10,
  },

  topRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  bottomRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginTop: 5,
  },

  name: {
    flex: 1,

    fontSize: 16,

    fontWeight: '700',

    color: '#111827',
  },

  time: {
    marginLeft: 10,

    fontSize: 12,

    color: '#6B7280',
  },

  message: {
    flex: 1,

    fontSize: 14,

    color: '#6B7280',

    marginRight: 10,
  },
});
