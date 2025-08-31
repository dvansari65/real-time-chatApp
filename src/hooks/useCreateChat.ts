"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"



export const useCreateChat = ()=>{
  const queryClient = useQueryClient()
  const router = useRouter()
  const createChatMutation = useMutation({
    mutationFn:async (userId:number)=>{
      try {
        const response = await fetch(`/api/chat/${userId}`,{
          method:"POST",
          credentials:"include"
        })
        const data = await response.json()
        if(!response.ok){
          throw new Error(data?.message || "failed to create chat!")
        }
        return data;
      } catch (error) {
        console.log("Server error!",error)
        throw error;
      }
    },
    onSuccess:(data)=>{
      queryClient.invalidateQueries({queryKey:['getAllChats']})
      if(data?.chat?.id){
        queryClient.invalidateQueries({queryKey:['chat',data.chat.id]})
      }
      if(data?.chat?.id){
        router.push(`/chat/${data?.chat?.id}`)
      }
        
    },
    onError:(error)=>{
      console.error("Failed to create chat:", error);
      toast.error(error?.message)
    }
  })
  return {
    createChat:createChatMutation.mutate,
    isCreating:createChatMutation.isPending,
    error:createChatMutation.error,
    isSuccess:createChatMutation.isSuccess
  }
}