import { useAuth } from "@/contextApi";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useChatCreation = () => {
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const router = useRouter();
    const { data, isLoading: authLoading } = useAuth();
    const user = data?.user;
  
    const createChat = useCallback(async (targetUserId: number) => {
      if (authLoading || !user || isCreatingChat) {
        return;
      }
  
      if (!targetUserId) {
        toast.error("Please select a user for chatting!");
        return;
      }
  
      setIsCreatingChat(true);
      
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId1: Number(user.id),
            userId2: targetUserId,
          }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || "Failed to create chat");
        }
  
        const chatId = data?.chat?.id;
        if (chatId) {
          router.push(`/chat/${chatId}?with=${targetUserId}`);
        } else {
          throw new Error("No chat ID received");
        }
      } catch (error) {
        console.error("Failed to create chat:", error);
        toast.error(error instanceof Error ? error.message : "Failed to create chat");
      } finally {
        setIsCreatingChat(false);
      }
    }, [user, authLoading, router, isCreatingChat]);
  
    return { createChat, isCreatingChat };
  };