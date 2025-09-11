export interface MessageData {
  content: string;
  senderId: number | undefined;
  chatId: number | undefined;
  type: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
  replyToId?: number | null;
}

export interface Message {
  id?: number | undefined;
  content?: string | undefined;
  chatId?: number | null;
  senderId?: number | undefined;
  replyToId?: number | null;
  createdAt?: Date | undefined;
  type?: string | undefined;
  status?:messageStatus,
  sender?:string | undefined
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
