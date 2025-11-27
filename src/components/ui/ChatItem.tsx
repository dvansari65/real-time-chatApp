"use client";

import React from "react";
import { Chat } from "@/types/chat";
import { useChatItem } from "@/hooks/useChatItem";
import GroupChatItem from "../chat/GroupChat/GroupChatItem";
import { usePathname } from "next/navigation";
import { OneToOneChatItem } from "../chat/OneToOnechatItem";

export interface ChatItemProps {
  chat: Chat;
  currentUserId: number | undefined;
  isActive?: boolean;
}

export default function ChatItem({
  chat,
  currentUserId,
  isActive = false,
}: ChatItemProps) {
  const pathname = usePathname();
  const { targetUser, lastMessage, handleOneToOneChat, handleGroupChat } =
    useChatItem(chat, currentUserId);

  // Determine if this chat is currently active
  const isChatActive = pathname?.includes(`/chat/${chat.id}`) || pathname?.includes(`/GroupChat/${chat.id}`) || isActive;

  // Render group chat
  if (chat?.isGroup) {
    return (
      <GroupChatItem
        id={chat.groupId}
        isGroup={true}
        createChatForGroup={handleGroupChat}
        groupName={String(chat.name)}
        messages={chat.messages}
        updatedAt={String(chat.updatedAt) || String(new Date())}
        members={chat.members}
        isActive={isChatActive}
      />
    );
  }

  // Don't render if no target user found
  if (!targetUser) {
    return null;
  }

  // Render one-to-one chat
  return (
    <OneToOneChatItem
      targetUser={targetUser}
      lastMessage={lastMessage}
      updatedAt={chat.updatedAt}
      isActive={isChatActive}
      onClick={handleOneToOneChat}
    />
  );
}