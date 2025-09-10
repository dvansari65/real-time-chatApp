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

import { useGetSingleUser } from "@/lib/api/getSingleUser";
import MessageInput from "@/components/MessageInput";
import { toast } from "sonner";

export default function Conversation() {
  const params = useParams();
  const chatId = params.id;
  const searchParam = useSearchParams()
  const userId = searchParam.get("userId")
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<messageStatus>("SENT");
  const [isOnline, setIsonline] = useState(false);
  const socket = useSocket();
  const { data } = useAuth();
  const user = data?.user;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  console.log("user id",userId)
  console.log("current id",user?.id)

  const { messages: chatMessages } = useSelector((state: RootState) => state.allChatData);
  const { isLoading } = useSelector((state: RootState) => state.Loading);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const {data:singleUserData,isLoading:singleUserDataLoading,error:singleUserError} = useGetSingleUser(Number(userId))
  console.log("single user data",singleUserData)
  useJoinChat(Number(chatId), Number(user?.id));


  useEffect(() => {
    if (!socket ) return;

    const handleConnect = () => {
      if (user) {
        socket.emit("user_authentication", {
          userId: user?.id,
          username: user?.username,
        });
      }
    };

    const handleUserOnline = (data: any) => {
      if (Number(singleUserData?.user?.id) === data.userId) {
        setIsonline(true);
      }
    };

    const handleUserOffline = (data: any) => {
      if (Number(singleUserData?.user?.id) === data.userId) {
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
      if (Number(singleUserData?.user?.id) === data.userId) {
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

    if (singleUserData?.user?.id && user) {
      socket.emit("check-user-status", { userId: Number(singleUserData?.user?.id) });
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
      socket.off("new-message", handleNewMessage);
      socket.off("message-delivered", handleMessageDelivered);
      socket.off("user-status-response", handleUserStatusResponse);
    };
  }, [socket, user?.id, user?.username, singleUserData?.user?.id]);

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

  if(singleUserError) return toast.error(singleUserError.message)
  return (
    <main className="flex-1 flex flex-col h-[100vh] bg-gray-900">
      <ChatHeader
        currentUserId={user?.id}
        handleLeaveChat={navigateToPreviousPage}
        userId={Number(singleUserData?.user?.id)}
        avatar={singleUserData?.user?.avatar}
        isOnline={singleUserData?.user?.isOnline}
        username={singleUserData?.user?.username}
        isLoadingUserData={singleUserDataLoading}
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
      <MessageInput
        setInput={setInput}
        input={input}
        handleKeyPress={handleKeyPress}
        sendMessage={sendMessage}
      />
    </main>
  );
}