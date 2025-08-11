export interface Message {
    content: string;
    senderId: number;
    chatId: number;
    type: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
    replyToId: number;
  }