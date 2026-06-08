import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from './Avatar';
import { colors, radius, shadow } from '../constants/theme';
import { HippoUser } from '../types';
import { formatLastSeen } from '../utils/time';

type Props = {
  user: HippoUser;
  onPress: () => void;
};

export default function UserCard({ user, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Avatar
        name={user.name}
        photoURL={user.photoURL}
        online={user.online}
        size={54}
      />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {user.name}
        </Text>
        <Text style={styles.status} numberOfLines={1}>
          {user.online ? 'Online now' : `Last seen ${formatLastSeen(user.lastSeen)}`}
        </Text>
      </View>

      <View style={styles.action}>
        <Text style={styles.actionText}>Chat</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.9,
  },
  content: {
    flex: 1,
    marginLeft: 13,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  status: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  action: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  actionText: {
    color: colors.primaryDark,
    fontWeight: '900',
    fontSize: 12,
  },
});