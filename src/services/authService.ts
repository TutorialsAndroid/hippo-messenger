import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '../config/google';
import { setCurrentUserOffline } from './presenceService';

export type GoogleLoginErrorResult = {
  message: string;
  shouldShowAddAccount: boolean;
};

export function configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });
}

export async function signInWithGoogle() {
  const hasPlayServices = await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: false,
  });

  if (!hasPlayServices) {
    throw new Error(
      'Google Play Services is not available or outdated. Please use a real Android device or a Google Play emulator.',
    );
  }

  const signInResult = await GoogleSignin.signIn();

  const idToken =
    signInResult.data?.idToken ||
    // fallback for older package response shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (signInResult as any).idToken;

  if (!idToken) {
    throw new Error(
      'Google Sign-In failed because idToken is missing. Check WEB_CLIENT_ID, SHA-1, SHA-256 and google-services.json.',
    );
  }

  const googleCredential = GoogleAuthProvider.credential(idToken);

  return signInWithCredential(getAuth(), googleCredential);
}

export function getGoogleSignInErrorResult(
  error: unknown,
): GoogleLoginErrorResult {
  if (isErrorWithCode(error)) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return {
        message:
          'Google Sign-In was cancelled. If no Google account is added on this phone, please add one first.',
        shouldShowAddAccount: true,
      };
    }

    if (error.code === statusCodes.IN_PROGRESS) {
      return {
        message: 'Google Sign-In is already in progress.',
        shouldShowAddAccount: false,
      };
    }

    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return {
        message:
          'Google Play Services is not available or outdated. Update Google Play Services or use a Google Play emulator.',
        shouldShowAddAccount: false,
      };
    }

    if (error.code === statusCodes.NULL_PRESENTER) {
      return {
        message:
          'Google Sign-In could not open because the app screen was not ready. Please try again.',
        shouldShowAddAccount: false,
      };
    }
  }

  const err = error as { message?: string };
  const message = err.message || 'Google Sign-In failed. Please try again.';

  const lowerMessage = message.toLowerCase();

  const looksLikeNoAccountIssue =
    lowerMessage.includes('account') ||
    lowerMessage.includes('cancel') ||
    lowerMessage.includes('sign in required');

  return {
    message,
    shouldShowAddAccount: looksLikeNoAccountIssue,
  };
}

export async function logoutUser() {
  const currentUser = getAuth().currentUser;

  if (currentUser?.uid) {
    await setCurrentUserOffline(currentUser.uid);
  }

  try {
    await GoogleSignin.signOut();
  } catch {
    // Ignore if Google session is already cleared.
  }

  await firebaseSignOut(getAuth());
}