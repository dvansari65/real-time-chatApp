import React from "react";
import { Button } from "./Button";
import { User } from "lucide-react";

interface ResultModaUserCardProps {
  currenUserId: number | undefined;
  id: number | undefined;
  handleChatCreate: (userId: number) => void;
  username: string | undefined;
  email: string | undefined;
}

function ResultModaUserCard({
  handleChatCreate,
  username,
  email,
  id,
  currenUserId,
}: ResultModaUserCardProps) {
  if (currenUserId === id) {
    return null;
  }
  return (
    <Button
      onClick={() => handleChatCreate(Number(id))}
      className="p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors border border-white/5 group"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-white font-medium">{username}</div>
          {email && <div className="text-gray-400 text-sm">{email}</div>}
        </div>
      </div>
    </Button>
  );
}

export default ResultModaUserCard;
