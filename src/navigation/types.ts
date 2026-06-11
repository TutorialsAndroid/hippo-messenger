import { HippoUser } from '../types';

export type RootStackParamList = {
  Login: undefined;

  MainTabs: undefined;

  Chat: {
    peer: HippoUser;
  };

  EditProfile: undefined;
};
