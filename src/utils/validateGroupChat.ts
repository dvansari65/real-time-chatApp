import { Chat, ChatValidationResult } from "@/types/chat";

export function validateGroupChat(
    currentUserId: number | undefined,
    chat: Chat
  ): ChatValidationResult {
    if (!chat?.isGroup) {
      return { isValid: false, error: "This is not a group chat!" };
    }
  
    if (!currentUserId) {
      return { isValid: false, error: "Please login first!" };
    }
  
    if (!chat?.members || chat.members.length < 2) {
      return {
        isValid: false,
        error: "At least 2 members required for a group chat!",
      };
    }
  
    if (!chat?.name?.trim()) {
      return { isValid: false, error: "Group name is required!" };
    }
  
    return { isValid: true };
  }
  