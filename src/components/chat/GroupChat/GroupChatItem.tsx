import { Button } from "@/components/ui/Button";
import { userFromChat } from "@/types/chat";
import { Message } from "@/types/message";
import { Users } from "lucide-react";
import React, { useMemo } from "react";

interface GroupChatItemProps {
  groupName: string;
  id?: string | undefined;
  name?: string;
  isGroup?: boolean;
  createdAt?: Date;
  updatedAt?: string;
  description?: string;
  messages?: Message[];
  members?: userFromChat[];
  createChatForGroup: () => void;
  isActive?: boolean;
}

function GroupChatItem({
  groupName,
  updatedAt,
  createChatForGroup,
  messages,
  members,
  isActive = false,
}: GroupChatItemProps) {
  // Format date with better UX
  const formattedDate = useMemo(() => {
    if (!updatedAt) return "Today";

    const date = new Date(updatedAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  }, [updatedAt]);

  // Get the latest message
  const latestMessage = useMemo(() => {
    if (!messages || messages.length === 0) {
      return {
        sender: null,
        content: "No messages yet",
      };
    }

    const lastMsg = messages[messages.length - 1];
    const content = lastMsg.content?.[0] || "No content";
    
    return {
      sender: lastMsg.sender,
      content: content.length > 40 ? `${content.substring(0, 40)}...` : content,
    };
  }, [messages]);

  // Member count
  const memberCount = members?.length || 0;

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Group Avatar */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-br from-purple-500 to-blue-500 ring-2 ring-purple-500/50"
            : "bg-gradient-to-br from-purple-500/20 to-blue-500/20"
        }`}
      >
        <Users
          className={`transition-colors duration-300 ${
            isActive ? "text-white" : "text-purple-400"
          }`}
          size={24}
        />
      </div>

      {/* Chat Content */}
      <Button
        onClick={createChatForGroup}
        className={`flex-1 min-w-0 p-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-purple-500/20 ring-2 ring-purple-500/50"
            : "hover:bg-white/5"
        }`}
      >
        <div className="w-full space-y-1">
          {/* Header: Group Name & Time */}
          <div className="flex justify-between items-center">
            <p
              className={`text-sm font-semibold truncate ${
                isActive ? "text-purple-300" : "text-purple-400"
              }`}
            >
              {groupName}
            </p>
            <span
              className={`text-[10px] flex-shrink-0 ml-2 ${
                isActive ? "text-purple-300" : "text-gray-400"
              }`}
            >
              {formattedDate}
            </span>
          </div>

          {/* Footer: Last Message & Member Count */}
          <div className="flex justify-between items-center gap-2">
            {/* Last Message */}
            <div className="flex items-center gap-1 min-w-0 flex-1">
              {latestMessage.sender && (
                <span
                  className={`text-xs font-medium flex-shrink-0 ${
                    isActive ? "text-purple-200" : "text-gray-400"
                  }`}
                >
                  {latestMessage.sender.username}:
                </span>
              )}
              <span
                className={`text-xs truncate ${
                  isActive ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {latestMessage.content}
              </span>
            </div>

            {/* Member Count Badge */}
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0 ${
                isActive
                  ? "bg-purple-500/30 text-purple-200"
                  : "bg-white/5 text-gray-400"
              }`}
            >
              <Users size={12} />
              <span className="text-xs font-medium">{memberCount}</span>
            </div>
          </div>
        </div>
      </Button>
    </div>
  );
}

export default GroupChatItem;