import React, { useState } from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getAuth } from '@react-native-firebase/auth';

import { colors } from '../constants/theme';

import { RootStackParamList } from '../navigation/types';

import useUserProfile from '../hooks/useUserProfile';

import { updateUserProfile } from '../services/userService';

import { syncUserProfileToChats } from '../services/profileSyncService';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const profile = useUserProfile();

  const [name, setName] = useState(profile?.name || '');

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const cleanName = name.trim();

    if (!cleanName) {
      Alert.alert('Invalid Name', 'Name cannot be empty');

      return;
    }

    try {
      setSaving(true);

      const uid = getAuth().currentUser?.uid;

      if (!uid) {
        return;
      }

      // Update main user profile
      await updateUserProfile(uid, {
        name: cleanName,
      });

      // Sync name to existing chats
      await syncUserProfileToChats(uid, {
        name: cleanName,
        photoURL: getAuth().currentUser?.photoURL ?? null,
      });

      navigation.goBack();
    } catch (error) {
      console.log(error);

      Alert.alert('Error', 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Name</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={[styles.button, saving && styles.disabled]}
        >
          <Text style={styles.buttonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: colors.bg,
  },

  header: {
    height: 60,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 16,
  },

  back: {
    fontSize: 36,

    fontWeight: '700',

    color: colors.text,
  },

  title: {
    fontSize: 20,

    fontWeight: '900',

    marginLeft: 20,

    color: colors.text,
  },

  content: {
    padding: 20,
  },

  label: {
    fontSize: 15,

    fontWeight: '700',

    marginBottom: 8,

    color: colors.text,
  },

  input: {
    height: 55,

    borderRadius: 16,

    backgroundColor: colors.card,

    borderWidth: 1,

    borderColor: colors.border,

    paddingHorizontal: 16,

    fontSize: 16,

    color: colors.text,
  },

  button: {
    marginTop: 30,

    height: 55,

    borderRadius: 18,

    backgroundColor: colors.primary,

    alignItems: 'center',

    justifyContent: 'center',
  },

  disabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#fff',

    fontSize: 16,

    fontWeight: '800',
  },
});
