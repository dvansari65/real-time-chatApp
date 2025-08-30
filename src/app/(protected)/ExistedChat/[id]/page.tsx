"use client";
import ChatHeader from "@/components/chat/chatHeader";
import MessageContainer from "@/components/ui/MessageContainer";
import { useAuth } from "@/contextApi";
import { RootState } from "@/lib/store";
import { Message, messageStatus } from "@/types/message";
import { useSocket } from "@/utils/SocketProvider";
import { Paperclip, Send, Smile } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

function page() {
  const params = useParams();
  const chatId = params.chatId;
  const [isOnline, setIsOnline] = useState(false);
  const [messageStatus, setMessageStatus] = useState<messageStatus>("SENT");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const socket = useSocket();
  const { data } = useAuth();
  const {
    user,
    messages: messagesFromRedux,
    chatId: chatIdFromRedux,
  } = useSelector((state: RootState) => state.allChatData);
  useEffect(() => {
    console.log("socket", socket);
    console.log("messages from redux", messagesFromRedux);
    if (!socket) return;
    const userData = {
      userId: data?.user?.id,
      username: data?.user?.username,
      avatar: data?.user?.avatar,
      phoneNumber: data?.user?.phoneNumber,
    };
    const handleConnect = () => {
      if (data?.user) {
        socket.emit("user_authentication", userData);
      }
    };
    const handleUserOnline = (data: any) => {
      console.log(`user is online ${data?.username}`);
      if (Number(user?.id) === data?.userId) {
        setIsOnline(true);
      }
    };
    const handleNewMessage = (data: any) => {
      console.log("new message", data);
      setMessages((prev) => [...prev, data?.message]);
    };
    const handleMessageDelivered = (data: any) => {
      console.log("message-delivered", data);
      setMessageStatus(data?.status);
    };
    socket.on("connect", handleConnect);
    socket.on("user-online", handleUserOnline);
    socket.on("new-message", handleNewMessage);
    socket.on("message-delivered", handleMessageDelivered);

    return () => {
      socket.off("user-online", handleUserOnline);
      socket.off("connect", handleConnect);
      socket.off("new-message", handleNewMessage);
    };
  }, []);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const sendMessage = () => {
    console.log("chat id from param", chatId);
    if (!chatId && !chatIdFromRedux) {
      toast.error("chat id is not provided!");
      setInput("");
      return;
    }
    const messageData = {
      content: input,
      senderId: Number(data?.user?.id),
      replyToId: null,
      type: "TEXT",
      chatId: Number(chatId) || chatIdFromRedux,
    };
    setMessages((prev) => [...prev, messageData]);
    if (socket && socket.connected) {
      socket.emit("send-message", messageData);
    } else {
      socket.once("connect", () => {
        socket.emit("send-message", messageData);
      });
    }
    setInput("");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(); 
    }
  };

  return user ? (
    <main className="flex-1 flex flex-col h-[100vh] bg-gray-900 ">
      <ChatHeader
        userId={Number(user?.id)}
        avatar={user?.avatar as string}
        isOnline={isOnline}
        username={user?.username as string}
      />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-15 ">
        {[...messagesFromRedux!, ...messages]?.map((msg) => (
          <div key={msg?.id}>
            <MessageContainer
              status={messageStatus}
              id={msg?.id}
              createdAt={msg?.createdAt}
              senderId={msg?.senderId}
              userId={Number(data?.user?.id)}
              content={msg?.content}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-gray-900 border-t border-gray-500 px-4 py-4 fixed bottom-0  width ">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                style={{
                  minHeight: "48px",
                  maxHeight: "120px",
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <Smile className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                <Paperclip className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
            </div>
          </div>
          <button
            onClick={sendMessage}
            
            disabled={!input.trim()}
            className={` w-12 h-12 rounded-full flex items-center justify-center transition-colors  ${
              input.trim()
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  ) : null;
}

export default page;
