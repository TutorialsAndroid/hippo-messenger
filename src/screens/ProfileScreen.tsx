import React from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import useUserProfile from '../hooks/useUserProfile';

import { getAuth, signOut } from '@react-native-firebase/auth';

import Avatar from '../components/Avatar';

import { colors } from '../constants/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../navigation/types';

export default function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const profile = useUserProfile();
  if (!profile) {
    return null;
  }

  async function handleLogout() {
    try {
      await signOut(getAuth());
    } catch (error) {
      Alert.alert('Logout Failed', 'Please try again.');
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Avatar
            name={profile.name || 'Hippo User'}
            photoURL={profile.photoURL}
            size={100}
          />

          <View style={styles.onlineDot} />
        </View>

        <Text style={styles.name}>{profile.name || 'Hippo User'}</Text>

        <Text style={styles.email}>{profile.email}</Text>
      </View>

      {/* ACCOUNT CARD */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>

        <ProfileRow label="Name" value={profile.name || '-'} />

        <ProfileRow label="Email" value={profile.email || '-'} />
      </View>

      {/* SETTINGS */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <ProfileRow label="Notifications" value="Enabled" />

        <ProfileRow label="Privacy" value="Default" />
      </View>

      {/* ACTIONS */}
      <Pressable
        onPress={() => navigation.navigate('EditProfile')}
        style={styles.action}
      >
        <Text style={styles.actionText}>Edit Profile</Text>
      </Pressable>

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
  action: {
    height: 50,

    borderRadius: 16,

    backgroundColor: colors.card,

    justifyContent: 'center',

    paddingHorizontal: 16,

    marginBottom: 12,
    marginTop: 20,
    marginLeft: 16,
    marginRight: 16,
  },

  actionText: {
    fontSize: 16,

    fontWeight: '700',

    color: colors.text,
  },
});
