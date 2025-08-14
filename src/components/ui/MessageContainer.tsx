import { Message } from "@/types/message";
import { partialUser } from "@/types/user";
import React from "react";

interface messageContainerProps {
    id:number,
    senderId:number,
    userId:number,
    content:string,
    createdAt:Date
}

function MessageContainer({id,senderId,userId,content,createdAt}:messageContainerProps) {
  return (
    <div
      key={id}
      className={
        senderId === userId
          ? ` flex justify-end  `
          : `flex justify-start`
      }
    >
      <div className="max-w-xs lg:max-w-md">
        <div
          className={
            senderId === userId
              ? `bg-green-600 text-white rounded-lg px-4 py-2 rounded-br-sm`
              : `bg-slate-300 text-gray-800 rounded-lg px-4 py-2 rounded-br-sm`
          }
        >
          <p className="text-sm">{content}</p>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">
            {new Date(createdAt || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MessageContainer;
