import { chatType } from "@/types/chat";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetChat = (chatId:number) => {
  
  return useQuery<chatType>({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/${chatId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log("chat dta:",data);
      
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
