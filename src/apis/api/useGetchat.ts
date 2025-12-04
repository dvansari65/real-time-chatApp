import { chatType } from "@/types/chat";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetChat = (chatId:string) => {
  return useQuery<chatType>({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      console.log("chatId from route",chatId)
      const res = await fetch(`/api/message/${chatId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log("cat data between two users",data)
      if (!res.ok) {
        toast.error(data.message || "failed to get response!");
      }
      return data;
    },
    enabled: !!chatId,
    staleTime: 20 * 60 * 60,
    retry: 2,
  });
};
