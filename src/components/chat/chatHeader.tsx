import { MoreVertical, Phone, Video } from "lucide-react";
import React from "react";
interface chatHeaderProps {
    avatar:string,
    username:string,
    isOnline:boolean | undefined,

}
function ChatHeader({avatar,username,isOnline}:chatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <img
              src={avatar}
              alt="user avatar"
              className="text-white font-medium text-sm rounded-[50%]"
            />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              {username}
            </h2>
            <p className="text-sm text-green-600">
              {isOnline ? "online" : "offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Phone className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
          <Video className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
          <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
