import { Message, messageStatus } from "./message";
// Types for events 
export interface MessageData {
    content: string;
    senderId: number;
    chatId: number;
    type: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
    replyToId?: number;
  }
  export interface UserAuthData {
    userId?: number;
    username?: string;
    avatar?: string;
    phoneNumber?: number;
    isOnline?:boolean
  }
  export interface JoinChatData {
    chatId?: number;
    userId?: number;
  }
  
  export interface newMesssageType{
    message:Message,
    timeStamp: Date,
  }

  export interface userJoinChatDataType{
    userId:number,
    chatId : number,
    timeStamp: Date,
  }

   export interface messageDeliveredType {
    messageId:number,
    status:messageStatus,
    chatId:number
   }
   
export interface userAuthenticatedDataType {
    userId:number,
    username:string,
    message: string
}

