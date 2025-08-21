import { ChildProcessWithoutNullStreams } from "child_process";
import { partialUser, User } from "./user";

export interface createGroupInput {
    userId:number ,
    admins : User[],
    GroupMembers : User[],
    discription?:string,
    name:string,
    profileImage:File | null
}

export interface createGroupInputTypesForFrontend {
    userId?:number | null,
    admins?: partialUser[] | [],
    GroupMembers : partialUser[] | [],
    discription?:string ,
    name?:string,
    profileImage?:File | null
}