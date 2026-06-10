import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function EmptyChats() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        No Conversations
      </Text>

      <Text style={styles.subtitle}>
        Start chatting with someone.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 8,
    color: '#71717A',
  },
});