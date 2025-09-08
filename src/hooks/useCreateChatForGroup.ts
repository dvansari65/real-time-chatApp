import { groupChatInput } from "@/types/CreateGroup"
import { useMutation, useQueryClient } from "@tanstack/react-query"


export const useCreateChatForGroup = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey:["groupChat"],
        mutationFn:async(chatInputTypeForGroupChat:groupChatInput)=>{
            try {
                const response = await fetch("/api/groupChat",{
                    method:"POST",
                    credentials:"include",
                    body:JSON.stringify(chatInputTypeForGroupChat)
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
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["getAllChats"]})
        }
    })
}