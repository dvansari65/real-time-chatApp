import { useAuth } from "@/contextApi";
import { ArrowLeft, MoreVertical, MoveLeft, Phone, Video } from "lucide-react";
import React from "react";
import { Button } from "../ui/Button";
interface chatHeaderProps {
    avatar:string,
    username:string,
    isOnline:boolean | undefined,
    userId:number,
    handleLeaveChat:()=>void
   
}

function ChatHeader({avatar,username,isOnline,userId,handleLeaveChat}:chatHeaderProps) {
  const {data} = useAuth()
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4   ">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className=" rounded-full flex items-center justify-center">
            <div className="flex gap-3">
              <Button onClick={handleLeaveChat}><ArrowLeft/></Button>
            <img
              src={avatar}
              alt="user avatar"
              className="text-white font-medium text-sm rounded-[50%] size-12 "
            />
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-purple-300">
              {
                userId === data?.user?.id ? `${username} (You)` : username 
              }
            </h2>
            <p className="text-sm text-gray-400">
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
