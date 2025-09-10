import { ChildProcessWithoutNullStreams } from "child_process";
import { partialUser, User } from "./user";
import { Chat } from "@prisma/client";
import { userFromChat } from "./chat";

export interface createGroupInput {
  userId: number | null;
  admins: partialUser[];
  GroupMembers: partialUser[];
  discription?: string;
  name: string;
  profileImage: File | null;
}
export interface groupType {
  id?: number;
  profileImage?: string;
  userId?: number;
  GroupMembers?: partialUser[];
  name?: string;
  discription?: string;
  admins?: partialUser[];
  createdBy?: string;
  chat?: Chat;
}
export interface getSingleGroupResponse {
  success: boolean;
  message: string;
  group: groupType;
}

export interface groupChatInput {
  isGroup: boolean;
  name: string | undefined;
  members: userFromChat[] | undefined;
  description?: string;
}
