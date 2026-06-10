import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

type Props = {
  count: number;
};

export default function UnreadBadge({ count }: Props) {
  if (count <= 0) {
    return null;
  }

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#5B5CE2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});