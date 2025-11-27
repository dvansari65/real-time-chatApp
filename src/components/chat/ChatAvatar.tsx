import { UserIcon } from "lucide-react";

interface ChatAvatarProps {
  avatar?: string;
  username?: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
}

export function ChatAvatar({
  avatar,
  username,
  size = "md",
  isOnline = false,
}: ChatAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white/10`}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={`${username}'s avatar`}
            className="w-full h-full object-cover"
          />
        ) : (
          <UserIcon size={size === "sm" ? 16 : size === "md" ? 20 : 24} className="text-white" />
        )}
      </div>

      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-gray-900" />
      )}
    </div>
  );
}