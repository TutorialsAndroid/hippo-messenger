import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { HippoUser } from '../types';
import { subscribeUsers } from '../services/userService';
import { logoutUser } from '../services/authService';
import Avatar from '../components/Avatar';
import UserCard from '../components/UserCard';
import EmptyState from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const currentUser = getAuth().currentUser;
  const [users, setUsers] = useState<HippoUser[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!currentUser?.uid) return;

    return subscribeUsers(currentUser.uid, setUsers);
  }, [currentUser?.uid]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter(user => {
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
    });
  }, [search, users]);

  function confirmLogout() {
    Alert.alert('Logout', 'Do you want to logout from Hippo Messenger?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logoutUser,
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>HIPPO MESSENGER</Text>
          <Text style={styles.title}>Chats</Text>
        </View>

        <Pressable onPress={confirmLogout}>
          <Avatar
            name={currentUser?.displayName || 'Me'}
            photoURL={currentUser?.photoURL}
            online
            size={48}
          />
        </Pressable>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroEmoji}>🦛</Text>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Private 1-to-1 messaging</Text>
          <Text style={styles.heroText}>
            Phase 1 is ready for realtime conversations with signed-in users.
          </Text>
        </View>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search users..."
        placeholderTextColor={colors.muted}
        style={styles.search}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.uid}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onPress={() => navigation.navigate('Chat', { peer: item })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No users found"
            message="Ask another user to sign in with Google. They will appear here automatically."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kicker: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.7,
    marginTop: 2,
  },
  heroCard: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 28,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 42,
    marginRight: 14,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  heroText: {
    color: 'rgba(255,255,255,0.78)',
    marginTop: 5,
    lineHeight: 19,
    fontWeight: '600',
  },
  search: {
    marginHorizontal: 20,
    marginTop: 18,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    color: colors.text,
    fontWeight: '700',
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
});