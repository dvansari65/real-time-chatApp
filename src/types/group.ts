import { Chat } from "./chat";
import { partialUser } from "./user"

export interface Group {
    id?:number,         
    profileImage?:string, 
    userId?:number,       
    GroupMembers?:partialUser[] 
    name?:string;         
    discription?:string,  
    admins?:partialUser[],       
    createdBy?:string    
    chat ?:Chat       
  }

export interface getSingleGroupResponse {
    success:boolean,
    message:string,
    group:Group
}
export interface groupChatResponse {
  message:string,
  chat:Chat,
  success:boolean
}