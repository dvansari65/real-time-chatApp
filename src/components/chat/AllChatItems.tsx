import React from "react";
import { User } from "@/types/user";
import Loader from "../ui/Loader";
import { User as UserIcon } from "lucide-react";
import { Chat } from "@/types/chat";

type chatProps = {
    avatar:string,
    isOnline:boolean,
    username:string
};

function AllChatsItem({  members }: chatProps) {
  return (
    <div className="flex items-center justify-start space-x-3 px-3   rounded-lg cursor-pointer w-full">
      {members?.map((member) => (
        <div key={member?.id}>
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            {member?.avatar ? (
              <img
                src={member?.avatar}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <UserIcon size={18} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-purple-400 truncate">
                {member?.username}
              </p>
              <p className="text-xs text-gray-500">{member?.isOnline}</p>
            </div>
            <p className="text-sm text-gray-500 truncate">
              Last message preview...
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AllChatsItem;
