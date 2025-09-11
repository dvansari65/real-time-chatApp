import { messageStatus } from "@/types/message";
import React from "react";
import { MessageStatusTicks } from "./MessageTick";
import MessageSkeleton from "./Skeleton/MessageSkeleton";

interface messageContainerProps {
  id: number | undefined;
  senderId: number | undefined;
  userId: number | undefined;
  content: string | undefined;
  createdAt: Date | undefined;
  status: messageStatus;
  messageLoading?:boolean
}

function MessageContainer({
  id,
  senderId,
  userId,
  content,
  createdAt,
  status,
  messageLoading
}: messageContainerProps) {
  if(messageLoading) return <MessageSkeleton messageCount={15}/>
  return (
    <div
      key={id}
      className={`flex ${senderId === userId ? "justify-end" : "justify-start"
        } animate-fade-in-up`}
      style={{ animationDelay: `${(id ?? 1 % 5) * 100}ms` }}
    >
      <div className="max-w-xs lg:max-w-md">
        <div
          className={`
            relative px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 
            ${senderId === userId
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-md transform hover:scale-[1.02]"
              : "bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 rounded-bl-md border border-gray-700 transform hover:scale-[1.02]"
            }
          `}
        >
        <p className="text-sm font-medium">{content}</p>
          {senderId === userId ? (
            <div className="absolute right-0 bottom-0 w-3 h-3 bg-indigo-600 rounded-br-full"></div>
          ) : (
            <div className="absolute left-0 bottom-0 w-3 h-3 bg-gray-800 rounded-bl-full"></div>
          )}
        </div>
        <div
          className={`flex mt-1 ${senderId === userId ? "justify-end" : "justify-start"
            } items-center gap-1`}
        >
          <span
            className={`text-xs ${senderId === userId ? "text-purple-300" : "text-gray-500"
              }`}
          >
            {new Date(createdAt || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {senderId === userId && <MessageStatusTicks status={status} />}
        </div>
      </div>
    </div>
  );
}

export default MessageContainer;
