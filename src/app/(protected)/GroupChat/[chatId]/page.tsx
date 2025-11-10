"use client";
import GroupChatHeader from "@/components/chat/GroupChat/GroupChatHeader";
import GroupMessageContainer from "@/components/chat/GroupChat/GroupMessageContainer";
import { RootState } from "@/lib/store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useGetSingleGroup } from "@/lib/api/getSingleGroup";
import { useAuth } from "@/contextApi";
import { Message, MessageData } from "@/types/message";
import MessageInput from "@/components/MessageInput";
import { toast } from "sonner";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "@/utils/SocketProvider";
import {
  messageDeliveredType,
  newMesssageType,
  UserAuthData,
  userAuthenticatedDataType,
  userJoinChatDataType,
} from "@/types/typesForSocketEvents";
import { useQueryClient } from "@tanstack/react-query";
import { getChatsOfGroup } from "@/lib/api/getChatsOfGroup";

function GroupChat() {
  const { data: currentUserData } = useAuth();
  const params = useParams();
  const chatId = Number(params.chatId);
  const searchParams = useSearchParams();
  const groupIdFromSearchParams = searchParams.get("groupId");
  const { id: groupId } = useSelector((state: RootState) => state.groupData);
  const [input, setInput] = useState("");
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageStatus, setMessageStatus] = useState<
    "DELIVERED" | "SENT" | "READ"
  >("SENT");

  const socket = useSocket();
  const queryClient = useQueryClient();
  const messageRef = useRef<HTMLDivElement>(null);
  const {
    data: groupData,
    isLoading,
    error,
  } = useGetSingleGroup( String(groupIdFromSearchParams) || String(groupId));

  const {
    data: groupChatData,
    isLoading: groupChatLoading,
    error: groupChatError,
  } = getChatsOfGroup(String(groupIdFromSearchParams) || String(groupId) );

  useEffect(() => {
    console.log("groupChatData", groupChatData);
    console.log("groupIdFromSearchParams", groupIdFromSearchParams);
    console.log("group id",groupId)
  }, [groupChatData,groupIdFromSearchParams,groupId]);

  useEffect(() => {
    if (!socket) return;
    queryClient.invalidateQueries({ queryKey: ["getAllChats"] });
    if (currentUserData?.user) {
      socket.emit("user_authentication", {
        userId: currentUserData?.user?.id,
        username: currentUserData?.user?.username,
      });
    }

    const handleUserOnline = (data: UserAuthData) => {
      console.log("user online data", data);
      queryClient.invalidateQueries({ queryKey: ["getAllChats"] });
      toast.success(`${data.username}`);
    };

    const handleSuccessfullAuthentication = (
      data: userAuthenticatedDataType
    ) => {
      toast.success(`${data?.userId} ${data.message}`);
    };

    if (chatId && currentUserData?.user?.id) {
      socket.emit("join-chat", { chatId, userId: currentUserData?.user?.id });
      toast.success(`${currentUserData?.user?.username} joined the chat!`);
    }

    const handleUserJoinChat = (data: userJoinChatDataType) => {
      toast.success(`${data.userId} join the chat ${data.chatId}`);
    };

    const handleNewMessage = (data: newMesssageType) => {
      console.log("new message", data);
      setMessages((prev) => [...prev, data.message]);
    };

    const handleMessageDelivered = (data: messageDeliveredType) => {
      setMessageStatus(data?.status);
    };

    const handleUserleftChat = (data: userJoinChatDataType) => {
      toast.success(`${data.userId} left chat!`);
    };

    const handleUserOffline = (userId: number) => {
      queryClient.invalidateQueries({ queryKey: ["getAllChats"] });
      toast.error(`user with id ${userId} is offline1`);
    };

    socket.on("user-online", handleUserOnline);
    socket.on("authentication-success", handleSuccessfullAuthentication);
    socket.on("user-joined-chat", handleUserJoinChat);
    socket.on("new-message", handleNewMessage);
    socket.on("message-delivered", handleMessageDelivered);
    socket.on("user-left-chat", handleUserleftChat);
    socket.on("user-offline", handleUserOffline);
    return () => {
      socket.off("user-online", handleUserOnline);
      socket.off("authentication-success", handleSuccessfullAuthentication);
      socket.off("user-joined-chat", handleUserJoinChat);
      socket.off("new-message", handleNewMessage);
      socket.off("message-delivered", handleMessageDelivered);
      socket.off("user-left-chat", handleUserleftChat);
      socket.off("user-offline", handleUserOffline);
    };
  }, [currentUserData?.user, chatId, socket, groupId, groupIdFromSearchParams]);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const sendMessage = useCallback(() => {
    if (!chatId) return;
    const payload: MessageData = {
      content: input,
      senderId: currentUserData?.user?.id,
      replyToId: null,
      type: "TEXT",
      chatId: Number(chatId),
    };
    if (socket && socket.connected) {
      socket.emit("send-message", payload);
    } else {
      socket.once("connect", () => {
        socket.emit("send-message", payload);
      });
    }
    setInput("");
  }, [currentUserData?.user, chatId, input, socket]);

  const handleLeaveChat = () => {
    if (chatId || currentUserData?.user?.id) {
      socket.emit("leave-chat", { chatId, userId: currentUserData?.user?.id });
      router.push("/");
      return;
    }
  };

  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (error) {
    toast.error(error.message);
    return null;
  }
  if (groupChatError) {
    toast.error(groupChatError.message);
    return null;
  }

  return (
    <div>
      <GroupChatHeader
        leaveChat={handleLeaveChat}
        isLoading={isLoading}
        group={groupData?.group}
      />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-16">
        {[...(groupChatData?.chat?.messages ?? []), ...(messages || [])].map(
          (message) => (
            <div key={message.id} className="">
              <GroupMessageContainer
                groupChatLoading={groupChatLoading}
                groupMembers={groupData?.group?.GroupMembers || []}
                currentUserId={Number(currentUserData?.user?.id)}
                status={messageStatus}
                message={message}
              />
            </div>
          )
        )}
        <div ref={messageRef}></div>
      </div>
      <MessageInput
        input={input}
        setInput={setInput}
        handleKeyPress={handleKeyPress}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default GroupChat;
