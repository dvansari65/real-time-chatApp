import io from "socket.io-client";


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

let socket : ReturnType<typeof io>
export const initializeSocket = ()=>{
    socket = io(BACKEND_URL)
    return socket
}

export const getSocket  = ()=>{
    if(!socket) throw new Error("socket not found!")
    return socket
}