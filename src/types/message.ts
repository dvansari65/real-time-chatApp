interface MessageData {
  content: string;
  senderId: number;
  chatId: number;
  type: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
  replyToId?: number | null;
}

export interface Message {
  id: number;
  content: string;
  chatId: number;
  senderId: number;
  replyToId: number;
  createdAt?: Date;
  type?: string;
}

export type messageStatus = "SENT" | "DELIVERED" | "READ";

export interface messageDataFromGetAllChatsResponse {
  chatId: number;
  content: string;
  createdAt:string;
  id: 18;
  senderId: 3;
  type: string;
  updatedAt: string;
}
