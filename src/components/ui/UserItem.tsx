import { useAuth } from "@/contextApi";
import { chatMember, userFromChat } from "@/types/chat";
import { Message, messageStatus } from "@/types/message";
import { partialUser } from "@/types/user";
import { UserIcon, Users } from "lucide-react";
import React from "react";
import { toast } from "sonner";

// type userProps = userFromChat[] | undefined;
// chatId:number
// i: number
// joinedAt: string
// leftAt: string | null
// role: string
// user: partialUser,
// userId: number
interface Chat {
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
      <div className="flex items-center gap-4 w-full ">
        <div>
          <Users size={38} />
        </div>
        <div className="flex flex-col  justify-center w-full">
          <div className="w-full flex justify-between ">
            <div className="text-xl text-gray-300">First Group</div>
            <div>10:12</div>
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="text-[15px] text-gray-500">Alice:hey there..</div>
            <div className="flex items-center gap-1">
              <Users className="text-gray-500" size={12} />
              <p className="text-gray-500 text-[14px]">
                {chatResponse?.members?.length}
              </p>
            </div>
          </div>
        </div>
      </div>
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
