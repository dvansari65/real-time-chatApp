import { userFromChat } from "@/types/chat";
import { Button } from "../ui/Button";
import { formatDistanceToNow } from "date-fns";
import { ChatAvatar } from "./ChatAvatar";
import { partialUser } from "@/types/user";
interface OneToOneChatItemProps {
  targetUser: partialUser;
  lastMessage: string;
  updatedAt?: Date;
  isActive?: boolean;
  onClick: () => void;
}

export function OneToOneChatItem({
  targetUser,
  lastMessage,
  updatedAt,
  isActive = false,
  onClick,
}: OneToOneChatItemProps) {
  const timeAgo = updatedAt
    ? formatDistanceToNow(new Date(updatedAt), { addSuffix: true })
    : "";

  return (
    <Button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-purple-500/20 ring-2 ring-purple-500/50"
          : "hover:bg-white/5"
      }`}
    >
      <ChatAvatar
        avatar={targetUser?.avatar}
        username={targetUser?.username}
        isOnline={targetUser?.isOnline}
      />

      <div className="flex-1 min-w-0 text-left">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-semibold text-white truncate">
            {targetUser?.username || "Unknown User"}
          </p>
          {timeAgo && (
            <p className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
              {timeAgo}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 truncate flex-1">
            {lastMessage}
          </p>
          
          {targetUser?.isOnline && (
            <span className="ml-2 px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded-full flex-shrink-0">
              Online
            </span>
          )}
        </div>
      </div>
    </Button>
  );
}