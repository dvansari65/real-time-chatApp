export interface MessageData {
    content: string;
    senderId: number;
    chatId: number;
    type: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
    replyToId?: number;
  }
  export interface UserAuthData {
    userId: number;
    username: string;
    avatar?: string;
    phoneNumber?: number;
  }
  export interface JoinChatData {
    chatId: number;
    userId: number;
  }
  