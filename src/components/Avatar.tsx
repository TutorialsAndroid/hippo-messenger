import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

type Props = {
  name?: string;
  photoURL?: string | null;
  size?: number;
  online?: boolean;
};

export default function Avatar({
  name = 'Hippo',
  photoURL,
  size = 48,
  online,
}: Props) {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
      {photoURL ? (
        <Image source={{ uri: photoURL }} style={styles.image} />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.34 }]}>{initials}</Text>
      )}

      {typeof online === 'boolean' && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: online ? colors.success : '#CBD5E1',
              right: size * 0.02,
              bottom: size * 0.02,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: colors.primaryDark,
    fontWeight: '900',
  },
  dot: {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});