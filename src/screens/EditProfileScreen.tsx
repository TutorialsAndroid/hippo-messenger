import React, { useEffect, useState } from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getAuth } from '@react-native-firebase/auth';

import { colors } from '../constants/theme';

import { RootStackParamList } from '../navigation/types';

import useUserProfile from '../hooks/useUserProfile';

import { updateUserProfile } from '../services/userService';

import { syncUserProfileToChats } from '../services/profileSyncService';

import { launchImageLibrary } from 'react-native-image-picker';

import { uploadProfileImage } from '../services/storageService';

import auth from '@react-native-firebase/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const currentUser = auth().currentUser;
  const profile = useUserProfile();

  const [name, setName] = useState(profile?.name || '');

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(
    currentUser?.photoURL || null,
  );

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName || '');
    }
  }, []);

  async function handlePickImage() {
    const result = await launchImageLibrary({
      mediaType: 'photo',

      selectionLimit: 1,
    });

    if (result.didCancel || !result.assets || !result.assets[0].uri) {
      return;
    }

    const imageUri = result.assets[0].uri;

    setSelectedImage(imageUri);
    setPreviewImage(imageUri);
  }

  async function handleSave() {
    const cleanName = name.trim();

    const currentUser = getAuth().currentUser;

    if (!currentUser) {
      return;
    }

    if (!cleanName && !selectedImage) {
      Alert.alert(
        'Nothing to update',
        'Please change your name or profile photo',
      );

      return;
    }

    try {
      setSaving(true);

      const uid = currentUser.uid;

      let updatedPhotoURL = currentUser.photoURL ?? null;

      // 1. Upload new image
      if (selectedImage) {
        updatedPhotoURL = await uploadProfileImage(uid, selectedImage);
      }

      // 2. Update Firebase Auth profile
      await currentUser.updateProfile({
        displayName: cleanName || currentUser.displayName || 'Hippo User',

        photoURL: updatedPhotoURL,
      });

      // Refresh auth user data
      await currentUser.reload();

      // 3. Update Realtime Database users/{uid}
      await updateUserProfile(uid, {
        name: cleanName || currentUser.displayName || 'Hippo User',

        photoURL: updatedPhotoURL,
      });

      // 4. Update existing chat rooms
      await syncUserProfileToChats(uid, {
        name: cleanName || currentUser.displayName || 'Hippo User',

        photoURL: updatedPhotoURL,
      });

      navigation.goBack();
    } catch (error) {
      console.log('PROFILE UPDATE ERROR', error);

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

      <Pressable onPress={handlePickImage} style={styles.avatarWrapper}>
        <Image
          source={
            previewImage
              ? { uri: previewImage }
              : require('../assets/default-avatar.jpg')
          }
          style={styles.avatar}
        />

        <View style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>
            {uploading ? 'Uploading...' : 'Change Photo'}
          </Text>
        </View>
      </Pressable>

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

  avatarWrapper: {
    alignItems: 'center',

    marginTop: 20,

    marginBottom: 30,
  },

  avatar: {
    width: 120,

    height: 120,

    borderRadius: 60,

    backgroundColor: colors.card,

    borderWidth: 2,

    borderColor: colors.primary,
  },

  changePhotoButton: {
    marginTop: 12,

    paddingHorizontal: 20,

    height: 42,

    borderRadius: 15,

    backgroundColor: colors.card,

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: 1,

    borderColor: colors.border,
  },

  changePhotoText: {
    color: colors.text,

    fontWeight: '700',
  },
});
