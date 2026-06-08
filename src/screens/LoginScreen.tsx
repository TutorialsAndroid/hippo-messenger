import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getGoogleSignInErrorResult,
  signInWithGoogle,
} from '../services/authService';
import { openGoogleAccountSettings } from '../services/accountSettingsService';
import { colors, radius, shadow } from '../constants/theme';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [showAddAccount, setShowAddAccount] = useState(false);

  async function handleGoogleLogin() {
    if (loading) return;

    try {
      setErrorText('');
      setShowAddAccount(false);
      setLoading(true);

      await signInWithGoogle();
    } catch (error) {
      const result = getGoogleSignInErrorResult(error);

      setErrorText(result.message);
      setShowAddAccount(result.shouldShowAddAccount);

      if (result.shouldShowAddAccount) {
        setTimeout(() => {
          openGoogleAccountSettings();
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.background}>
        <View style={styles.circleOne} />
        <View style={styles.circleTwo} />

        <View style={styles.hero}>
          <View style={styles.logoCard}>
            <Text style={styles.logo}>🦛</Text>
          </View>

          <Text style={styles.title}>Hippo Messenger</Text>
          <Text style={styles.subtitle}>
            A clean, secure and realtime messaging experience for modern users.
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Welcome back</Text>
          <Text style={styles.panelText}>
            Continue with Google to start private one-to-one conversations.
          </Text>

          {errorText ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorText}</Text>

              {showAddAccount ? (
                <Pressable
                  onPress={openGoogleAccountSettings}
                  style={({ pressed }) => [
                    styles.addAccountButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.addAccountText}>Add Google Account</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          <Pressable
            disabled={loading}
            onPress={handleGoogleLogin}
            style={({ pressed }) => [
              styles.googleButton,
              pressed && !loading && styles.pressed,
              loading && styles.disabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleText}>Continue with Google</Text>
              </>
            )}
          </Pressable>

          <Text style={styles.footerText}>
            By continuing, you agree to Hippo Messenger’s basic community and
            privacy standards.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  background: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 22,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  circleOne: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: -80,
    right: -70,
  },
  circleTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: 170,
    left: -90,
  },
  hero: {
    marginTop: 60,
  },
  logoCard: {
    width: 94,
    height: 94,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  logo: {
    fontSize: 48,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    maxWidth: 320,
    fontWeight: '600',
  },
  panel: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 22,
    ...shadow,
  },
  panelTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  panelText: {
    color: colors.muted,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 22,
  },
  googleButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    fontWeight: '900',
    marginRight: 10,
  },
  googleText: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 15,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.7,
  },
  footerText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 18,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  addAccountButton: {
    marginTop: 12,
    backgroundColor: '#991B1B',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  addAccountText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
});
