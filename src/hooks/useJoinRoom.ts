import { useSocket } from "@/utils/SocketProvider"
import { useEffect } from "react"

export const useJoinChat = (chatId:number , userId:number)=>{
    const socket = useSocket()
    useEffect(()=>{
        if(!socket || !chatId || !userId) return;
        const joinChat = ()=>{
            socket.emit("join-chat",{chatId,userId})
        }
        if(socket.connected){
            joinChat()
        }else{
            socket.once("connect",joinChat)
        }

        return ()=>{
            if(socket.connected){
                socket.emit("leave-chat",{
                    chatId,
                    userId
                })
            }
        }

    },[chatId,userId,socket])
}