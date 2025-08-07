"use client"

import { useState } from "react"


export const fetchChats = async ()=>{
    const [chatLoading,setLoading] = useState(false)
    const [chatError,setChatError] = useState("")
    const [data,setData] = useState({})
    try {
        const res = await fetch("/api/chat/messages")
        const data = await res.json()
        if(!res.ok){
            setChatError(data.error || "something went wrong!")
            return;
        }
        
    } catch (error) {
        
    }
}