import React from "react";
import { User } from "@/types/user";
import Loader from "./ui/Loader";
import { User as UserIcon } from "lucide-react";
interface userProps {
  id?: number;
  username?: string;
  email?: string;
  phoneNumber?: number;
  avatar?: string;
  bio?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

function Users({
  username,
  avatar,
  isOnline,
}: userProps) {
  return (
    <div className="p-2 space-y-2">
      {
        <div className="flex items-center justify-start space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-start">
            {avatar ? (
              <img
                src={avatar}
                className="text-gray-600 font-medium rounded-[50%] object-cover"
              />
            ) : (
              <UserIcon size={18} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">
                {username}
              </p>
              <p className="text-xs text-gray-500">{isOnline}</p>
            </div>
            <p className="text-sm text-gray-500 truncate">
              Last message preview...
            </p>
          </div>
        </div>
      }
    </div>
  );
}

export default Users;
