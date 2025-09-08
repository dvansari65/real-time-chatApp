import { ChildProcessWithoutNullStreams } from "child_process";
import { partialUser, User } from "./user";

export interface createGroupInput {
    userId:number | null  ,
    admins : partialUser[],
    GroupMembers : partialUser[] ,
    discription?:string,
    name:string,
    profileImage:File | null
}
export interface groupType {
    userId?:number | null  ,
    admins ?: partialUser[],
    GroupMembers? : partialUser[] ,
    discription?:string,
    name:string,
    profileImage:File | null
}
export interface getSingleGroupResponse {
    success:boolean,
    message:string,
    group:groupType
}

export interface groupChatInput {
    isGroup:boolean,
    name:string,
    members:partialUser[],
    description?:string
}