import io from "socket.io-client";

let socket : ReturnType<typeof io>
export const initializeSocket = ()=>{
    socket = io("http://localhost:3001")
    return socket
}

export const getSocket  = ()=>{
    if(!socket) throw new Error("socket not found!")
        return socket
}