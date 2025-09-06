"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"



export const useCreateChat = ()=>{
  const queryClient = useQueryClient()
 return useMutation({
  mutationKey:["createChat"],
  mutationFn:async(userId:number)=>{
    try {
      const response = await fetch(`/api/chat/${userId}`,{
        method:"POST",
        credentials:"include"
      })
      const data = await response.json()
      if(!response.ok){
        throw new Error(data?.message || "failed to create chat!")
      }
      console.log("data from api",data)
      return data;
    } catch (error:any) {
      console.log("Server error!",error.message)
      throw error;
    }
  },
  onSuccess:()=>{
    queryClient.invalidateQueries({queryKey:["getAllChats"]})
    queryClient.invalidateQueries({queryKey:["getGroups"]})
  }
 })
}


