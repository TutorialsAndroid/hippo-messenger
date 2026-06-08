import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { HippoMessage } from '../types';
import { formatMessageTime } from '../utils/time';

type Props = {
  message: HippoMessage;
  mine: boolean;
};

export default function ChatBubble({ message, mine }: Props) {
  return (
    <View style={[styles.row, mine ? styles.mineRow : styles.otherRow]}>
      <View style={[styles.bubble, mine ? styles.mineBubble : styles.otherBubble]}>
        <Text style={[styles.text, mine ? styles.mineText : styles.otherText]}>
          {message.text}
        </Text>

        <Text style={[styles.time, mine ? styles.mineTime : styles.otherTime]}>
          {formatMessageTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginVertical: 5,
    paddingHorizontal: 16,
  },
  mineRow: {
    alignItems: 'flex-end',
  },
  otherRow: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  mineBubble: {
    backgroundColor: colors.bubbleMine,
    borderBottomRightRadius: 6,
  },
  otherBubble: {
    backgroundColor: colors.bubbleOther,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
  },
  mineText: {
    color: '#FFFFFF',
  },
  otherText: {
    color: colors.text,
  },
  time: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  mineTime: {
    color: 'rgba(255,255,255,0.72)',
  },
  otherTime: {
    color: colors.muted,
  },
});