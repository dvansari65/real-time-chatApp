"use client";
import ChatHeader from "@/components/chat/chatHeader";
import MessageContainer from "@/components/ui/MessageContainer";
import { useAuth } from "@/contextApi";
import { useJoinChat } from "@/hooks/useJoinRoom";
import { RootState } from "@/lib/store";
import { messageStatus } from "@/types/message";
import { useSocket } from "@/utils/SocketProvider";
import { Paperclip, Send, Smile } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

function page() {
  const router = useRouter()
  const params = useParams();
  const chatId = params.id;
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
  // console.log("messages from api",messagesFromRedux)
  useJoinChat(Number(chatId), Number(data?.user?.id));
  
  useEffect(() => {
    if (!socket) return;
    const userData = {
      userId: data?.user?.id,
      username: data?.user?.username,
      avatar: data?.user?.avatar,
      phoneNumber: data?.user?.phoneNumber,
    };
    // console.log("userData",userData)
    const handleConnect = () => {
      toast.success("socket connected!!");
    };
    if (data?.user) {
      toast.success(`${data?.user?.id} authenticated!`)
      socket.emit("user_authentication", userData);
      toast.success(`${userData.username} authenticated`);
      // toast.success(`${data?.user} authenticated`)
    }
    
    const handleUserOnline = (data: any) => {
      console.log("is online status data",data)
      setIsOnline(data?.isOnline );
      toast.success(`You are now ${data?.isOnline ? "online" : "offline"}`);
    };
    console.log("is online",isOnline)
    const handleNewMessage = (data: any) => {
      setMessages((prev) => [...prev, data?.message]);
    };
    const handleUserJoinChat = (data: any) => {
      toast.success(`${data?.userId} is connected to ${data?.chatId} room`);
    };
    const handleMessageDelivered = (data: any) => {
      toast.success(`is message delivered!${data?.status}`)
      setMessageStatus(data?.status);
    };
    const handleSuccessfulLeaveChat = (data:any)=>{
      toast.success(`${data?.userId} leave from ${data?.chatId}`)
    }
    socket.on("connect", handleConnect);
    socket.on("user-online", handleUserOnline);
    socket.on("new-message", handleNewMessage);
    socket.on("message-delivered", handleMessageDelivered);
    socket.on("user-join-chat", handleUserJoinChat);
    socket.on("user-left-chat", handleSuccessfulLeaveChat);
    return () => {
      socket.off("user-online", handleUserOnline);
      socket.off("connect", handleConnect);
      socket.off("new-message", handleNewMessage);
      socket.off("message-delivered", handleMessageDelivered);
      socket.off("user-join-chat", handleUserJoinChat);
      socket.off("user-left-chat", handleSuccessfulLeaveChat);
    };
  }, [socket, data?.user, user?.id, chatId, chatIdFromRedux]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
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
    console.log();
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
  const leavechat = ()=>{
    socket.emit("leave-chat",{chatId:Number(chatId) || Number(chatIdFromRedux),userId:Number(data?.user?.id)})
    router.push("/")
  }
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
      {
        (user?.id !== data?.user?.id) && <ChatHeader
        handleLeaveChat={leavechat}
          userId={Number(user?.id)}
          avatar={user?.avatar as string}
          isOnline={user?.isOnline }
          username={user?.username as string}
        />
  
      }
      {/* Messages Container */}
      {data?.user?.id && (data?.user?.id !== user?.id) && (
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
      )}

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
