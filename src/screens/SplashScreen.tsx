import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.logo}>
        <Text style={styles.logoText}>🦛</Text>
      </View>
      <Text style={styles.title}>Hippo Messenger</Text>
      <Text style={styles.subtitle}>Fast. Friendly. Realtime.</Text>
      <ActivityIndicator color="#FFFFFF" size="small" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  logoText: {
    fontSize: 48,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.78)',
    marginTop: 8,
    fontWeight: '700',
  },
  loader: {
    marginTop: 28,
  },
});