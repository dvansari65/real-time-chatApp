"use client"
import { ArrowLeft, MoreVertical, Phone, User, Video, Users, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import UserInfoModal from "../modal/UserInfo";
import { Group } from "@/types/group";
import GroupInfoModal from "../modal/Group/GroupInfo";

interface UnifiedChatHeaderProps {
  // Common props
  handleLeaveChat: () => void;
  currentUserId: number | undefined;
  isLoadingUserData?: boolean;
  
  // One-to-one specific (optional)
  avatar?: string | undefined;
  username?: string | undefined;
  isOnline?: boolean | undefined;
  userId?: number | null;
  phoneNumber?: number | undefined;
  
  // Group specific (optional)
  group?: Group | undefined;
  onShowMembers?: () => void;
  onShowSettings?: () => void;
  
  // Type discriminator
  type: "personal" | "group";
}

function UnifiedChatHeader({
  handleLeaveChat,
  currentUserId,
  isLoadingUserData,
  avatar,
  username,
  isOnline,
  userId,
  phoneNumber,
  group,
  onShowMembers,
  onShowSettings,
  type,
}: UnifiedChatHeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const activeMembers = group?.GroupMembers?.filter((member) => member.isOnline) || [];

  useEffect(() => {
    if (type === "personal" && currentUserId === userId) {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["getAllChats"] });
      router.push("/home");
    }
  }, [currentUserId, userId, type]);

  return (
    <>
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              if (isLoadingUserData) return;
              if (type === "personal") setIsUserModalOpen(true);
              if (type === "group") setIsGroupModalOpen(true);
            }}
          >
            <div className="flex gap-3 items-center">
              <Button onClick={handleLeaveChat}>
                <ArrowLeft />
              </Button>

              {/* Avatar/Icon */}
              {isLoadingUserData ? (
                <div className="size-12 rounded-full bg-gray-600 animate-pulse" />
              ) : type === "personal" ? (
                avatar ? (
                  <img
                    src={avatar}
                    alt="user avatar"
                    className="rounded-full size-12"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-purple-600 flex items-center justify-center">
                    <User size={25} className="text-white" />
                  </div>
                )
              ) : (
                <div className="relative">
                  {group?.profileImage ? (
                    <img
                      src={group.profileImage}
                      alt={group.name}
                      className="size-12 rounded-full"
                    />
                  ) : (
                    <div className="size-12 rounded-full bg-purple-600 flex items-center justify-center">
                      <Users size={25} className="text-white" />
                    </div>
                  )}
                  {activeMembers.length > 0 && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                      <span className="text-[10px] text-white font-bold">
                        {activeMembers.length}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Name and Status */}
            <div>
              {isLoadingUserData ? (
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-600 rounded-md animate-pulse" />
                  <div className="h-3 w-16 bg-gray-700 rounded-md animate-pulse" />
                </div>
              ) : type === "personal" ? (
                <>
                  <h2 className="font-semibold text-purple-300">
                    {userId === currentUserId ? `${username} (You)` : username}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {isOnline ? "online" : "offline"}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-semibold text-purple-300">
                    {group?.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {group?.GroupMembers?.length} members
                    {activeMembers.length > 0 && (
                      <span className="text-green-400 ml-1">
                        • {activeMembers.length} online
                      </span>
                    )}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {type === "personal" ? (
              <>
                <Phone className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-300" />
                <Button className="w-5 h-5 text-gray-400">
                  <Video size={14} />
                </Button>
                <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-300" />
              </>
            ) : (
              <>
                <button
                  onClick={onShowMembers}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Users className="w-5 h-5" />
                </button>
                <button
                  onClick={onShowSettings}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {type === "personal" && (
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
                  phoneNumber,
                }
              : undefined
          }
        />
      )}

      {type === "group" && (
        <GroupInfoModal
          isOpen={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
          group={group}
          currentUserId={currentUserId}
        />
      )}
    </>
  );
}

export default UnifiedChatHeader;