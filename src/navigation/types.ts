import { HippoUser } from '../types';

export type RootStackParamList = {
  Home: undefined;
  Chat: {
    peer: HippoUser;
  };
};