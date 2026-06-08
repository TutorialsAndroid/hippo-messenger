import { Linking, Platform } from 'react-native';

export async function openGoogleAccountSettings() {
  if (Platform.OS !== 'android') {
    await Linking.openSettings();
    return;
  }

  try {
    // Opens Android "Add account" screen.
    await Linking.sendIntent('android.settings.ADD_ACCOUNT_SETTINGS');
  } catch {
    try {
      // Fallback: opens sync/account settings.
      await Linking.sendIntent('android.settings.SYNC_SETTINGS');
    } catch {
      // Final fallback: opens app settings.
      await Linking.openSettings();
    }
  }
}