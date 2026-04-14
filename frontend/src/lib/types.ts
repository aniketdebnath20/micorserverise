import { Socket } from "socket.io-client";

export interface User {
  _id: string;
  name: string;
  email: string;
  status?: "online" | "away" | "offline";
}

export interface LatestMessage {
  _id?: string;
  text: string;
  sender: string;
  createdAt?: string;
}

export interface Chat {
  _id: string;
  users: string[];

  latestMessage: LatestMessage | null; // ✅ FIXED

  createdAt: string; // fix typo
  updatedAt: string; // fix typo

  unseenCount?: number;
}

export interface Chats {
  _id: string;
  user: User;
  chat: Chat;
}

export interface AppContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean;

  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;

  logoutUser: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchChats: () => Promise<void>;

  chats: Chats[] | null;
  users: User[] | null;

  setChats: React.Dispatch<React.SetStateAction<Chats[] | null>>;
}

export interface Message {
  _id: string;
  chatId: string;
  sender: string;
  text: string;
  seen: boolean;
  seenAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetMessagesResponse {
  messages: Message[];
  user: User;
}

export interface SocketContextTypes {
  socket: Socket | null;
  onlineUsers: string[];
}
