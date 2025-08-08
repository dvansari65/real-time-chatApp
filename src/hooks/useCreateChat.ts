"use client";
import { useState } from "react";

interface useCreateChatProps {
    chatError : string ,
    chatLoading:boolean,
    data:any,
    createChat : (id:number)=>Promise<void>
}

export const useCreateChat =  ():useCreateChatProps => {
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [data, setData] = useState();
  const createChat = async (id: number) => {
    setChatLoading(true)
    setChatError("")
    try {
      const res = await fetch(`/api/chat/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setChatError(data.error || "failed to create chat!");
        return;
      }
      setData(data);
      setChatError("");
    } catch (error: any) {
      setChatError(error.message || error.data.message || "server error!");
    } finally {
      setChatLoading(false);
    }
  };
  return {
    chatError,
    chatLoading,
    data,
    createChat,
  };
};
