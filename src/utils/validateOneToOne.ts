import { ChatValidationResult } from "@/types/chat";

export function validateOneToOneChat(
    currentUserId: number | undefined,
    targetUserId: number | undefined
  ): ChatValidationResult {
    if (!currentUserId) {
      return { isValid: false, error: "Please login first!" };
    }
  
    if (!targetUserId) {
      return { isValid: false, error: "Target user not found!" };
    }
  
    if (targetUserId === currentUserId) {
      return { isValid: false, error: "You cannot chat with yourself!" };
    }
  
    return { isValid: true };
  }