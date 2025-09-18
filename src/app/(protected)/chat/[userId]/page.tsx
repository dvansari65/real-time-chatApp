"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "@/utils/SocketProvider";
import { useAuth } from "@/contextApi";
import ChatHeader from "@/components/chat/chatHeader";
import { useJoinChat } from "@/hooks/useJoinRoom";
import MessageContainer from "@/components/ui/MessageContainer";
import { Message, messageStatus } from "@/types/message";

import { useGetSingleUser } from "@/lib/api/getSingleUser";
import MessageInput from "@/components/MessageInput";
import { toast } from "sonner";
import { messageDeliveredType, newMesssageType, userAuthenticatedDataType, userJoinChatDataType } from "@/types/typesForSocketEvents";
import { useGetChat } from "@/lib/api/useGetchat";
import { useQueryClient } from "@tanstack/react-query";


export default function Conversation() {
  const params = useParams();
  const chatId = params.userId;
  const searchParam = useSearchParams()
  const userId = searchParam.get("userId")
  console.log(userId)
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<messageStatus>("SENT");
  const [isOnline,setIsOnline] = useState(false)
  const [inCall, setInCall] = useState(false);
  const socket = useSocket();
  const { data } = useAuth();
  const user = data?.user;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  console.log("user",user)
  const queryClient = useQueryClient()
  const {data:chatBetweenTwoUsersData,isLoading:chatBetweenTwoUsersLoading,error} = useGetChat(String(chatId))
  const {data:singleUserData,isLoading:singleUserDataLoading,error:singleUserError} = useGetSingleUser(Number(userId))

  useJoinChat(Number(chatId), Number(user?.id));

  useEffect(() => {
    if (!socket ) return;
    console.log("socket",socket)
    const handleConnect = () => {
      const payload = {
        userId:user?.id ,
        username: user?.username,
        avatar: user?.avatar,
        phoneNumber: user?.phoneNumber
      }
      if (user) {
        socket.emit("user_authentication",payload);
      }
    };

    const handleUserOnline = (data: userAuthenticatedDataType) => {
      console.log("userAuthenticatedData",data)
      if(Number(singleUserData?.user?.id) === Number(data.userId)){
        queryClient.invalidateQueries({queryKey:["getAllChats"]})
        queryClient.invalidateQueries({queryKey:["user"]})
        setIsOnline(true)
      }
    };

    if(chatId && userId){
      socket.emit("join-chat",{chatId,userId})
      console.log("user joined the chat!")
    }

    const handleUserLeavechat = (data: userJoinChatDataType) => {
      if (Number(singleUserData?.user?.id) === data.userId) {
        toast.error(`${data.userId} left chat ${data.chatId}`)
      }
    };

    const handleNewMessage = (data: newMesssageType) => {
      console.log("new message ",data)
      setMessages((prev) => [...prev, data.message]);
    };

    const handleMessageDelivered = (data: messageDeliveredType) => {
      setStatus(data.status);
    };

    const handleUserleftChat = (data:userJoinChatDataType)=>{
      toast.success(`${data.userId} left chat!`)
    };

    const handleSuccessfullAuthentication = (data:userAuthenticatedDataType)=>{
      toast.success(`${data?.userId} ${data.message}`)
    }

    const handleUserOffline = (userId:number)=>{
      if(Number(singleUserData?.user?.id) === userId){
        queryClient.invalidateQueries({queryKey:["getAllChats"]})
        queryClient.invalidateQueries({queryKey:["user"]})
        setIsOnline(true)
      }
    }
  

    socket.on("connect", handleConnect);
    socket.on("authentication-success",handleSuccessfullAuthentication)
    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserLeavechat);
    socket.on("new-message", handleNewMessage);
    socket.on("message-delivered", handleMessageDelivered);
    socket.on("user-left-chat",handleUserleftChat)
    socket.on("user-offline",handleUserOffline)
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
      socket.off("new-message", handleNewMessage);
      socket.off("message-delivered", handleMessageDelivered);
      socket.off("user-left-chat",handleUserleftChat)
      socket.off("authentication-success",handleSuccessfullAuthentication)
    };
  }, [socket, user?.id, user?.username, singleUserData?.user?.id,]);

  useEffect(()=>{
    console.log("is online ",isOnline)
  },[isOnline])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage()
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
  if(chatId && !userId) {
    toast.error("user id not obtained!")
    return router.push("/")
  }
  return (
    <main className="flex-1 flex flex-col h-[100vh] bg-gray-900 w-full">
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
        {[ ...(chatBetweenTwoUsersData?.chat?.messages ?? []),...messages].map((msg) => (
          <div key={msg.id}>
            <MessageContainer
              messageLoading={chatBetweenTwoUsersLoading}
              status={status || "SENT"}
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
      <div className="w-full">
      <MessageInput
        setInput={setInput}
        input={input}
        handleKeyPress={handleKeyPress}
        sendMessage={sendMessage}
      />
      </div>
    </main>
  );
}