import { useMemo, useCallback } from "react";
import { Chat, userFromChat } from "@/types/chat";
import { toast } from "sonner";
import { useChatOperations } from "@/hooks/useChatOperation";
import { validateOneToOneChat } from "@/utils/validateOneToOne";
import { validateGroupChat } from "@/utils/validateGroupChat";
import { partialUser } from "@/types/user";

export function useChatItem(chat: Chat, currentUserId: number | undefined) {
  const { createChatforOneToOneUser, createChatForGroup } = useChatOperations();

  // Get the other user in a one-to-one chat
  const targetUser = useMemo<partialUser | null>(()=>{
    if (!chat?.members || !currentUserId || chat.isGroup) {
      return null;
    }

    const otherUsers = chat.members
      .filter(
        (member) =>
          member?.user?.id &&
          typeof member.user.id === "number" &&
          member.user.id !== currentUserId
      )
      .map((member) => member.user);

    return otherUsers.length > 0 ? otherUsers[0] : null;
  }, [chat?.members, currentUserId, chat?.isGroup]);

  // Get last message preview
  const lastMessage = useMemo(() => {
    if (!chat?.messages || chat.messages.length === 0) {
      return "No messages yet";
    }

    const last = chat.messages[chat.messages.length - 1];
    const content = last?.content || "";
    
    return content.length > 50 
      ? `${content.substring(0, 50)}...` 
      : content;
  }, [chat?.messages]);

  // Handle one-to-one chat creation
  const handleOneToOneChat = useCallback(() => {
    const validation = validateOneToOneChat(currentUserId, targetUser?.id);

    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    if(!targetUser?.id) return;

    createChatforOneToOneUser(targetUser.id);
  }, [currentUserId, targetUser, createChatforOneToOneUser]);

  // Handle group chat creation
  const handleGroupChat = useCallback(() => {
    const validation = validateGroupChat(currentUserId, chat);

    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    createChatForGroup(
      true,
      chat.name,
      chat.members,
      chat.description,
      chat.groupId
    );
  }, [currentUserId, chat, createChatForGroup]);

  return {
    targetUser,
    lastMessage,
    handleOneToOneChat,
    handleGroupChat,
  };
}