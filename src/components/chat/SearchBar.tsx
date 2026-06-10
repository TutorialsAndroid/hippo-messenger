import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
} from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({
  value,
  onChangeText,
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search chats..."
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  input: {
    height: 52,

    borderRadius: 16,

    backgroundColor: '#F4F4F5',

    paddingHorizontal: 18,

    fontSize: 15,

    color: '#111827',
  },
});