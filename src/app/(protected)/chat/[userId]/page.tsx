"use client";
import { useState, useEffect, useRef } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "@/utils/SocketProvider";
import { useAuth } from "@/contextApi";
import ChatHeader from "@/components/chat/chatHeader";
import { useJoinChat } from "@/hooks/useJoinRoom";
import MessageContainer from "@/components/ui/MessageContainer";
import { messageStatus } from "@/types/message";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import RedirectPage from "../../Redirecting/page";

export default function Conversation() {
  const params = useParams();
  const chatId = params.id;
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<messageStatus>("SENT");
  const [isOnline, setIsonline] = useState(false);
  const socket = useSocket();
  const { data } = useAuth();
  const user = data?.user;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages: chatMessages } = useSelector((state: RootState) => state.allChatData);
  const { user: queriedUser } = useSelector((state: RootState) => state.queriedData);
  const { isLoading } = useSelector((state: RootState) => state.Loading);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useJoinChat(Number(chatId), Number(user?.id));

  useEffect(() => {
    if (queriedUser?.isOnline !== undefined) {
      setIsonline(queriedUser?.isOnline);
    }
  }, [queriedUser]);

  useEffect(() => {
    if (!socket || !queriedUser) return;

    const handleConnect = () => {
      if (user) {
        socket.emit("user_authentication", {
          userId: user?.id,
          username: user?.username,
        });
      }
    };

    const handleUserOnline = (data: any) => {
      if (Number(queriedUser?.id) === data.userId) {
        setIsonline(true);
      }
    };

    const handleUserOffline = (data: any) => {
      if (Number(queriedUser?.id) === data.userId) {
        setIsonline(false);
      }
    };

    const handleNewMessage = (data: any) => {
      setMessages((prev) => [...prev, data?.message]);
    };

    const handleMessageDelivered = (data: any) => {
      setStatus(data?.Status);
    };

    const handleUserStatusResponse = (data: any) => {
      if (Number(queriedUser?.id) === data.userId) {
        setIsonline(data.isOnline);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);
    socket.on("new-message", handleNewMessage);
    socket.on("message-delivered", handleMessageDelivered);
    socket.on("user-status-response", handleUserStatusResponse);

    if (socket.connected && user) {
      socket.emit("user_authentication", {
        userId: user?.id,
        username: user?.username,
      });
    }

    if (queriedUser?.id && user) {
      socket.emit("check-user-status", { userId: Number(queriedUser?.id) });
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
      socket.off("new-message", handleNewMessage);
      socket.off("message-delivered", handleMessageDelivered);
      socket.off("user-status-response", handleUserStatusResponse);
    };
  }, [socket, user?.id, user?.username, queriedUser?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  };

  const sendMessage = () => {
    const messagePayload = {
      content: input.trim(),
      senderId: user?.id,
      chatId: Number(chatId),
      type: "TEXT",
      replyToId: null,
    };
    setMessages((prev) => [...prev, messagePayload]);

    if (socket && socket.connected) {
      socket.emit("send-message", messagePayload);
    } else {
      socket.once("connect", () => {
        socket.emit("send-message", messagePayload);
      });
    }
    setInput("");
  };
  const navigateToPreviousPage = ()=>{
      router.push("/")
  }

  return (
    <main className="flex-1 flex flex-col h-[100vh] bg-gray-900">
      <ChatHeader
        handleLeaveChat={navigateToPreviousPage}
        userId={Number(queriedUser?.id)}
        avatar={queriedUser?.avatar as string}
        isOnline={isOnline}
        username={queriedUser?.username as string}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-15">
        {[...(chatMessages || []), ...messages].map((msg) => (
          <div key={msg?.id}>
            <MessageContainer
              status={status || "DELIVERED"}
              id={msg?.id}
              createdAt={msg?.createdAt}
              senderId={msg?.senderId}
              userId={Number(user?.id)}
              content={msg?.content}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gray-900 border-t border-gray-500 px-4 py-4 fixed bottom-0 width">
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