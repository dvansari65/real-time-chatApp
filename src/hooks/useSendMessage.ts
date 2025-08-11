import { useAuth } from "@/contextApi";
import { useSocket } from "@/utils/SocketProvider";
import { useCallback } from "react";

interface MessageData {
  content: string;
  senderId: number;
  chatId: number;
  type: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
  replyToId: number;
}

export const useSendMessage = () => {
  const socket = useSocket();
  const { data: authData } = useAuth();

  const sendMessage = useCallback(
    (data: Omit<MessageData, "senderId">) => {
      if (!socket || !authData?.user)
        throw new Error("Not connected or authenticated");

      return new Promise<void>((resolve, reject) => {
        socket.emit(
          "send-messae",
          {
            ...data,
            senderId: authData?.user?.id,
          },
          (response: { success: boolean; error?: string }) => {
            if (response.success) {
              resolve();
            } else {
              reject(response.error || "Failed to send message");
            }
          }
        );
      });
    },
    [socket, authData?.user]
  );
  return { sendMessage };
};
