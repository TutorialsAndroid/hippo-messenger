import React from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getAuth } from '@react-native-firebase/auth';

import { signOut } from '@react-native-firebase/auth';

import Avatar from '../components/Avatar';

import { colors } from '../constants/theme';

export default function ProfileScreen() {
  const user = getAuth().currentUser;

  async function handleLogout() {
    try {
      await signOut(getAuth());
    } catch (error) {
      Alert.alert('Logout Failed', 'Please try again.');
    }
  }

  if (!user) {
    return null;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Avatar
            name={user.displayName || 'Hippo User'}
            photoURL={user.photoURL}
            size={100}
          />

          <View style={styles.onlineDot} />
        </View>

        <Text style={styles.name}>{user.displayName || 'Hippo User'}</Text>

        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* ACCOUNT CARD */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>

        <ProfileRow label="Name" value={user.displayName || '-'} />

        <ProfileRow label="Email" value={user.email || '-'} />
      </View>

      {/* SETTINGS */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <ProfileRow label="Notifications" value="Enabled" />

        <ProfileRow label="Privacy" value="Default" />
      </View>

      {/* LOGOUT */}

      <Pressable onPress={handleLogout} style={styles.logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: colors.bg,
  },

  header: {
    alignItems: 'center',

    paddingVertical: 40,
  },

  avatarWrapper: {
    position: 'relative',
  },

  onlineDot: {
    width: 20,

    height: 20,

    borderRadius: 10,

    backgroundColor: '#22C55E',

    position: 'absolute',

    right: 5,

    bottom: 8,

    borderWidth: 3,

    borderColor: '#fff',
  },

  name: {
    fontSize: 26,

    fontWeight: '900',

    marginTop: 18,

    color: colors.text,
  },

  email: {
    marginTop: 6,

    fontSize: 14,

    color: colors.muted,
  },

  card: {
    backgroundColor: '#fff',

    marginHorizontal: 16,

    marginTop: 16,

    borderRadius: 20,

    padding: 18,
  },

  sectionTitle: {
    fontSize: 17,

    fontWeight: '800',

    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    paddingVertical: 12,
  },

  label: {
    color: colors.muted,

    fontSize: 15,
  },

  value: {
    color: colors.text,

    fontWeight: '700',

    maxWidth: '60%',
  },

  logout: {
    margin: 20,

    height: 52,

    borderRadius: 16,

    backgroundColor: '#EF4444',

    alignItems: 'center',

    justifyContent: 'center',
  },

  logoutText: {
    color: '#fff',

    fontSize: 16,

    fontWeight: '800',
  },
});
