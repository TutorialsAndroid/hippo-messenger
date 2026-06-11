import {
  getStorage,
  ref,
  putFile,
  getDownloadURL,
} from '@react-native-firebase/storage';

import { updateUserProfile } from './userService';

export async function uploadProfileImage(uid: string, uri: string) {
  const storage = getStorage();

  const imageRef = ref(storage, `profileImages/${uid}/profile.jpg`);

  await putFile(imageRef, uri);

  const downloadURL = await getDownloadURL(imageRef);

  await updateUserProfile(uid, {
    photoURL: downloadURL,
  });

  return downloadURL;
}
