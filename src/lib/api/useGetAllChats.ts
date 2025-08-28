import { getAllChatsResponseType } from "@/types/chat"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export const useGetAllChats = ()=>{
    return useQuery<getAllChatsResponseType>({
        queryKey:["getAllChats"],
        queryFn:async ()=>{
            try {
                const response = await fetch("/api/chat",{
                    credentials:"include",
                    method:"GET"
                })
                const data = await response.json()
                if(!response.ok){
                    toast.error(data?.message || "failed to get chats!")
                    throw new Error(data?.message || "failed to get chats!")
                }
                console.log("data from all chats",data);
                return data
            } catch (error:any) {
                console.error("server error",error)
                toast.error(error?.message)
                throw new Error(error?.message)
            }

        },
        staleTime:20*60*60,
        retry:2
    })
}