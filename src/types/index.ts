export type HippoUser = {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
  online?: boolean;
  lastSeen?: number;
  createdAt?: number;
  updatedAt?: number;
};

export type HippoMessage = {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  type: 'text';
  createdAt: number;
};