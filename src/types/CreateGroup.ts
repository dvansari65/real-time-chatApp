import { User } from "./user";

export interface createGroupInput {
    userId:number,
    admins : User[],
    GroupMembers : User[],
    discription?:string,
    name:string,
    profileImage:string
}