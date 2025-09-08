import { useAuth } from "@/contextApi";
import { chatMember, userFromChat } from "@/types/chat";
import { Message, messageStatus } from "@/types/message";
import { partialUser } from "@/types/user";
import { UserIcon, Users } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import GroupChatItem from "../chat/GroupChat/GroupChatItem";

// type userProps = userFromChat[] | undefined;
// chatId:number
// i: number
// joinedAt: string
// leftAt: string | null
// role: string
// user: partialUser,
// userId: number
export interface Chat {
  id?: number;
  name?: string;
  isGroup?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  messages?: Message[];
  members?: userFromChat[];
}

function ChatItem({
  chatResponse,
  currentUserId,
}: {
  chatResponse: Chat;
  currentUserId: number;
}) {
  const filteredUser = chatResponse?.members?.find(
    (member) => member.user?.id !== currentUserId
  );
  const user = filteredUser?.user;
  if (chatResponse?.isGroup) {
    return (
      <GroupChatItem
        groupName={String(chatResponse?.name)}
        chatResponse={chatResponse}
        updatedAt={chatResponse?.updatedAt || new Date()}
      />
    );
  }
  return (
    <div className="flex items-center justify-between w-full ">
      {filteredUser?.user?.id !== currentUserId ? (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user?.avatar}
                className="w-full h-full rounded-full object-cover"
                alt={`${user?.username}'s avatar`}
              />
            ) : (
              <UserIcon size={18} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="w-full  flex justify-between items-center">
              <p className="text-sm font-medium text-purple-400 truncate">
                {user?.username}
              </p>
              <p className="text-[11px] text-gray-400">
                {user?.isOnline ? "Online" : "Offline"}
              </p>
            </div>
            <p className="text-sm text-gray-500 truncate">
              Last message preview...
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ChatItem;
