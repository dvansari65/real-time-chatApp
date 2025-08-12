"use client";
import { useState, useEffect, useRef } from "react";
import {
  Send,
  Smile,
  Paperclip,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useSocket } from "@/utils/SocketProvider";
import { useAuth } from "@/contextApi";
import { getSingleUser } from "@/lib/api/getSingleUser";
import { useGetChat } from "@/lib/api/useGetchat";
import { LoadingDots } from "@/components/ui/ThreeDotsLoader";
import ChatHeader from "@/components/chat/chatHeader";
import DummyMsgContainer from "@/components/chat/DummyMsgContainer";
import { useJoinChat } from "@/hooks/useJoinRoom";

export default function Conversation() {
  const params = useParams();
  const chatId = params.id;
  const searchParams = useSearchParams();
  const userId = searchParams.get("with");
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const socket = useSocket();
  const { data } = useAuth();
  const user = data?.user;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: singleUserData, isLoading: singleUserLoading } = getSingleUser(Number(userId));
  const { data: chatData, isLoading: chatLoading } = useGetChat(Number(chatId));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useJoinChat(Number(chatId), Number(user?.id));

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("socket connected!");
      if (user) {
        socket.emit("user_authentication", {
          userId: user?.id,
          username: user?.username,
        });
      }
    });

    socket.on("new-message", ({ message }) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("connect");
      socket.off("new-message");
    };
  }, [socket, user?.id, user?.username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (!socket || !input.trim() || !user?.id || !chatId) return;

    const messagePayload = {
      content: input.trim(),
      senderId: user.id,
      chatId: Number(chatId),
      type: "text",
      replyToId: null,
    };

    // Optimistic UI
    setMessages((prev) => [
      ...prev,
      {
        ...messagePayload,
        sender: { username: user.username, avatar: user.avatar },
        createdAt: new Date(),
        pending: true,
      },
    ]);

    socket.emit("send-message", messagePayload);
    setInput("");
  };

  return (
    <main className="flex-1 flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      {singleUserLoading ? (
        <div className="w-full h-[60px] bg-gray-200 "></div>
      ) : (
        <ChatHeader
          avatar={singleUserData?.user?.avatar as string}
          isOnline={singleUserData?.user?.isOnline}
          username={singleUserData?.user?.username as string}
        />
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatLoading && (
          <div className="w-full h-full flex justify-center items-center">
            <LoadingDots />
          </div>
        )}
        {chatData?.chat?.messages.length === 0 && messages.length === 0 ? (
          <DummyMsgContainer />
        ) : (
          [...(chatData?.chat?.messages || []), ...messages].map((msg, idx) => (
            <div key={idx} className="flex justify-end">
              <div className="max-w-xs lg:max-w-md">
                <div className="bg-green-600 text-white rounded-lg px-4 py-2 rounded-br-sm">
                  <p className="text-sm">{msg.content}</p>
                </div>
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-500">
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-end space-x-3">
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
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
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
  );
}
