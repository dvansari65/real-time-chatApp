"use client"
import { useMutation } from "@tanstack/react-query"

export const useCreateChat = ()=>{
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
      return data;
    } catch (error:any) {
      console.log("Server error!",error.message)
      throw error;
    }
  }
 })
}



