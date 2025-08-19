"use client"
import { useAuth } from "@/contextApi";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {useDispatch, useSelector} from "react-redux"
import { setLoading } from "@/features/Redux/loadingSlice";
export const useChatCreation = () => {
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const router = useRouter();
    const { data, isLoading: authLoading } = useAuth();
    const dispatch = useDispatch()
    const user = data?.user;
  
    const createChat = useCallback(async (targetUserId: number) => {
      dispatch(setLoading(true))
      router.push("/Redirecting")
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
        dispatch(setLoading(false))
      }
    }, [user, authLoading, router, isCreatingChat]);
  
    return { createChat, isCreatingChat,authLoading };
  };