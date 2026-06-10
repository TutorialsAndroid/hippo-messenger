import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function OnlineIndicator() {
  return <View style={styles.dot} />;
}

const styles = StyleSheet.create({
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});