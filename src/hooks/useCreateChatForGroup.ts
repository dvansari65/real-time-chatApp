import { groupChatInput } from "@/types/CreateGroup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"


export const useCreateChatForGroup = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey:["groupChat"],
        mutationFn:async(chatInputTypeForGroupChat:groupChatInput)=>{
            try {
                if(!chatInputTypeForGroupChat.groupId){
                    return toast.error("please provide group id")
                }
                const groupId = String(chatInputTypeForGroupChat.groupId)
                const response = await fetch(`/api/groupChat/${groupId}`,{
                    method:"POST",
                    credentials:"include",
                    body:JSON.stringify(chatInputTypeForGroupChat)
                })
                const data = await response.json();
                if(!response.ok){
                    throw new Error(data?.message || "failed to create group chat!")
                }
                return data;
            } catch (error:any) {
                console.log("failed to create group chat!",error?.message)
                throw error;
            }
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["getAllChats"]})
        }
    })
}