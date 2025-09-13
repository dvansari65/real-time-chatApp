
import { Chat } from "@/types/chat"
import { groupChatResponse } from "@/types/group"
import {  useQuery } from "@tanstack/react-query"
import { toast } from "sonner"


export const getChatsOfGroup = (groupId:string)=>{
    return useQuery<groupChatResponse>({
        queryKey:["groupChatOfSingleGroup",groupId],
        queryFn:async()=>{
            try {
                if(!groupId){
                    return toast.error("please provide group id")
                }
                const response = await fetch(`/api/groupChat/${groupId}`,{
                    method:"GET",
                    credentials:"include",
                })
                const data = await response.json();
                if(!response.ok){
                    throw new Error(data?.message || "failed to create group chat!")
                }
                console.log("group chat",data)
                return data;
            } catch (error:any) {
                console.log("failed to create group chat!",error?.message)
                throw error;
            }
        }
    })
}