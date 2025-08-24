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

