"use client"
import { ArrowLeft, MoreVertical, Phone, User, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import UserInfoModal from "../modal/UserInfo";

interface chatHeaderProps {
    avatar: string | undefined,
    username: string | undefined,
    isOnline: boolean | undefined,
    userId: number | null,
    handleLeaveChat: () => void,
    isLoadingUserData?: boolean,
    currentUserId:number | undefined,
    phoneNumber:number | undefined
}

function ChatHeader({
    avatar,
    username,
    isOnline,
    userId,
    handleLeaveChat,
    isLoadingUserData,
    phoneNumber,
    currentUserId,
  }: chatHeaderProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
    useEffect(() => {
      if (currentUserId === userId) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["getAllChats"] });
        router.push("/home");
      }
    }, [currentUserId, userId]);
  
    return (
      <>
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* ✅ ONLY WRAPPED — LAYOUT UNCHANGED */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => !isLoadingUserData && setIsUserModalOpen(true)}
            >
              <div className="rounded-full flex items-center justify-center">
                <div className="flex gap-3 items-center">
                  <Button onClick={handleLeaveChat}>
                    <ArrowLeft />
                  </Button>
  
                  {isLoadingUserData ? (
                    <div className="size-12 rounded-full bg-gray-600 animate-pulse" />
                  ) : avatar ? (
                    <img
                      src={avatar}
                      alt="user avatar"
                      className="text-white font-medium text-sm rounded-[50%] size-12"
                    />
                  ) : (
                    <User size={25} />
                  )}
                </div>
              </div>
  
              <div>
                {isLoadingUserData ? (
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-600 rounded-md animate-pulse" />
                    <div className="h-3 w-16 bg-gray-700 rounded-md animate-pulse" />
                  </div>
                ) : (
                  <>
                    <h2 className="font-semibold text-purple-300">
                      {userId === currentUserId
                        ? `${username} (You)`
                        : username}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {isOnline ? "online" : "offline"}
                    </p>
                  </>
                )}
              </div>
            </div>
  
            <div className="flex items-center space-x-4">
              <Phone className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
              <Button className="w-5 h-5 text-gray-600">
                <Video size={14} />
              </Button>
              <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
            </div>
          </div>
        </div>
  
        {/* ✅ MODAL – NO LAYOUT SIDE EFFECT */}
        <UserInfoModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          user={
            userId
              ? {
                  id: userId,
                  username: username ?? "",
                  avatar,
                  isOnline,
                  phoneNumber
                }
              : undefined
          }
        />
      </>
    );
  }
  
  export default ChatHeader;