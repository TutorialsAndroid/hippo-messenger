import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Avatar from './Avatar';
import { colors } from '../constants/theme';

type Props = {
  name: string;
  photoURL?: string | null;
  online?: boolean;

  lastMessage?: string;

  unreadCount?: number;

  time?: string;

  onPress: () => void;
};

export default function ChatListItem({
  name,
  photoURL,
  online,
  lastMessage,
  unreadCount = 0,
  time,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Avatar name={name} photoURL={photoURL} online={online} size={56} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>

          {time ? <Text style={styles.time}>{time}</Text> : null}
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.message} numberOfLines={1}>
            {lastMessage || 'Start a conversation'}
          </Text>

          {unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          ) : null}
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
    paddingVertical: 14,

    backgroundColor: colors.bg,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  pressed: {
    opacity: 0.9,
  },

  content: {
    flex: 1,
    marginLeft: 14,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  name: {
    flex: 1,

    color: colors.text,
    fontSize: 16,
    fontWeight: '800',

    marginRight: 10,
  },

  time: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },

  message: {
    flex: 1,

    color: colors.muted,
    fontSize: 14,

    marginRight: 10,
  },

  badge: {
    minWidth: 22,
    height: 22,

    borderRadius: 11,

    backgroundColor: colors.primary,

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 6,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
