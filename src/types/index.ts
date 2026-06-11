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

export interface ChatMemberInfo {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;

  online?: boolean;

  lastSeen?: number;
}

export interface ChatRoom {
  chatId: string;

  members: Record<string, boolean>;

  memberInfo: Record<string, ChatMemberInfo>;

  lastMessage?: {
    text: string;

    senderId: string;

    receiverId: string;

    createdAt: number;
  };

  unread?: Record<string, number>;

  typing?: Record<string, boolean>;

  createdAt: number;

  updatedAt: number;
}

export interface ChatPreview {
  chatId: string;

  peer: HippoUser;

  lastMessage?: {
    text: string;
    senderId: string;
    receiverId: string;
    createdAt: number;
  };

  unreadCount: number;

  typing: boolean;

  updatedAt: number;
}
