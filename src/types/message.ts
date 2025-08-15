interface MessageData {
  content: string;
  senderId: number;
  chatId: number;
  type: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
  replyToId?: number | null;
}

export interface Message {
  id:number,
  content:string,
  chatId :number
  senderId :number,
  replyToId : number,
  createdAt?:Date
}

export type messageStatus = "SENT" | "DELIVERED" | "READ"
