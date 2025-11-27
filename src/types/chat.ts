import { Message } from "./message";
import { partialUser } from "./user";


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
  isGroup?:boolean,
  groupId?:string | undefined,
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  messages?: Message[];
  members?: userFromChat[];
}
export interface chatType {
  success: boolean;
  chat: Chat | undefined;
  message:string | undefined
}

export interface getAllChatsResponseType{
  success:boolean,
  chats:Chat[]
}

export interface userFromChat {
chatId:number
id: number
joinedAt: string
leftAt: string | null
role: string
user: partialUser,
userId: number
}

export interface chatInputTypeForGroupChat {
  name:string;
  members:partialUser[];
  description?:string;
  isGroup:boolean;
}

export interface createdChatReponse {
  success:boolean,
  chat:Chat
}

export interface ChatItemProps {
  chat: Chat;
  currentUserId: number | undefined;
  onSelectChat: (chatId: number) => void;
  isActive?: boolean;
}

export interface ChatValidationResult {
  isValid: boolean;
  error?: string;
}