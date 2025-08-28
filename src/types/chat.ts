import { Message } from "./message";


export interface chatMember {
  id?: number | undefined;
  username?: string | undefined;
  email?: string | undefined;
  phoneNumber?: number | undefined;
  avatar?: File | null;
  bio?: string | undefined;
  isOnline?: boolean | undefined;
  lastSeen?: Date | undefined;
  createdAt?: Date | undefined;
  password?: string | undefined;
}

export interface Chat {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  messages?: Message[];
  members?: chatMember[];
}
export interface chatType {
  success: boolean;
  chat: Chat;
}

export interface getAllChatsResponseType{
  success:boolean,
  chats:Chat[]
}
