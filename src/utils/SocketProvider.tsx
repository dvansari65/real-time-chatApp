"use client"
import { initializeSocket } from "@/lib/socket";
import { createContext, ReactNode, useContext, useEffect } from "react";

interface SocketProviderProps {
    children:ReactNode
}

const SocketContext = createContext<ReturnType<typeof initializeSocket> | null>(null)

export const SocketProvider = ({children}:SocketProviderProps)=>{
    const socket = initializeSocket()

    useEffect(()=>{
        socket.connect()

        return ()=>{
            socket.disconnect()
        }

    },[])
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = ()=>{
    const socket = useContext(SocketContext)
    if(!socket) throw new Error("useSocket must be used within SocketProvide")
    return socket
}