import { useAuth } from "@/contextApi";
import { chatMember, userFromChat } from "@/types/chat";
import { partialUser, User } from "@/types/user";
import { UserIcon } from "lucide-react";
import React from "react";

type userProps = userFromChat[] | undefined;

function UserItem({ users }: { users: userProps }) {
  const { data } = useAuth();
  const otherUser = users?.find((i) => i.user?.id !== data?.user?.id);

  if (!otherUser) return null;

  return (
    <div className="flex items-center justify-between w-full ">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          {otherUser?.user?.avatar ? (
            <img
              src={otherUser?.user?.avatar}
              className="w-full h-full rounded-full object-cover"
              alt={`${otherUser?.user?.username}'s avatar`}
            />
          ) : (
            <UserIcon size={18} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-purple-400 truncate">
            {otherUser?.user?.username}
          </p>
          <p className="text-sm text-gray-500 truncate">
            Last message preview...
          </p>
        </div>
      </div>
      {/* Right side: Online status */}
      <div className="flex items-center space-x-2">
        <p className="text-xs text-gray-500">
          {otherUser?.user?.isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}

export default UserItem;
