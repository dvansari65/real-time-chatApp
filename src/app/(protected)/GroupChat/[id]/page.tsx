"use client"
import GroupChatHeader from '@/components/chat/GroupChat/GroupChatHeader'
import GroupMessageContainer from '@/components/chat/GroupChat/GroupMessageContainer'
import { RootState } from '@/lib/store'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetSingleGroup } from '@/lib/api/getSingleGroup'
import { useAuth } from '@/contextApi'
import { Message, MessageData } from '@/types/message'
import MessageInput from '@/components/MessageInput'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { useSocket } from '@/utils/SocketProvider'

function page() {
    const {data:currentUserData} = useAuth()
    const params = useParams()
    const chatId = params.id
    const {id:groupId} = useSelector((state:RootState)=>state.groupData)
    console.log("group id",groupId)
    const [input,setInput] = useState("")
    const router = useRouter()
    const {data:groupData,isLoading,error} = useGetSingleGroup(Number(groupId))
    const [messages,setMessages] = useState<any[] >()
    const [messageStatus,setMessageStatus] = useState<"DELIVERED" | "SENT" | "READ">("SENT")
    const socket = useSocket()
   
    useEffect(()=>{
      if(!socket) return;

      if(currentUserData?.user){
        socket.emit("user_authentication",{userId:currentUserData?.user?.id, username:currentUserData?.user?.username})
      }

      const handleUserOnline = (data:any)=>{
        console.log("user online data",data)
        toast.success(`${data?.username}`)
      }
      const handleSuccessfullAuthentication = (data:any)=>{
        toast.success(`${data?.username} ${data.message}`)
      }
      if(chatId && currentUserData?.user?.id){
        socket.emit("join-chat",{chatId,userId: currentUserData?.user?.id})
        toast.success(`${currentUserData?.user?.username} joined the chat!`)
      }
      const handleUserJoinChat = (data:any)=>{
        toast.success(`${data.userId} join the chat ${data.chatId}`)
      }

      const handleNewMessage = (data:any)=>{
        setMessages(prev=>[...(prev ?? []), data?.message])
      }

      const handleMessageDelivered = (data:any)=>{
        setMessageStatus(data?.status);
      }

      const handleUserleftChat = (data:any)=>{
        toast.success(`${data.userId} left chat!`)
      }

      socket.on("user-online",handleUserOnline)
      socket.on("authentication-success",handleSuccessfullAuthentication)
      socket.on("user-joined-chat",handleUserJoinChat)
      socket.on("new-message",handleNewMessage)
      socket.on("message-delivered",handleMessageDelivered)
      socket.on("user-left-chat",handleUserleftChat)
      return ()=>{
        socket.off("user-online",handleUserOnline)
        socket.off("authentication-success",handleSuccessfullAuthentication)
        socket.off("user-joined-chat",handleUserJoinChat)
        socket.off("new-message",handleNewMessage)
        socket.off("message-delivered",handleMessageDelivered)
        socket.off("user-left-chat",handleUserleftChat)
      }
    },[currentUserData?.user,chatId,socket,groupId])
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
      }
    };
    const sendMessage = useCallback(()=>{
      const payload:MessageData ={
        content:input,
        senderId:currentUserData?.user?.id, 
        replyToId:null,
        type:"TEXT", 
        chatId:Number(chatId)
      }
      setMessages(prev=> [...(prev || []),payload])
      socket.emit("send-message",payload)
      setInput("")
    },[currentUserData?.user,chatId,input])

    const handleLeaveChat = ()=>{
      if(chatId || currentUserData?.user?.id){
        socket.emit("leave-chat",{chatId,userId:currentUserData?.user?.id})
        router.push("/")
        return;
      }
    }

    if(error)return toast.error(error.message)

    if(!groupId){
      return router.push("/")
    }

  return (
    <div>
        <GroupChatHeader
        leaveChat={handleLeaveChat}
          isLoading={isLoading}
          group={groupData?.group!}
        />
        {
          [...messages || []].map(message => (
            <GroupMessageContainer
              groupMembers={groupData?.group?.GroupMembers || []}
              currentUserId={Number(currentUserData?.user?.id)}
              status={messageStatus}
              message={message}
            />
          ))
        }
        <MessageInput
          input={input}
          setInput={setInput}
          handleKeyPress={handleKeyPress}
          sendMessage={sendMessage}
        />
    </div>
  )
}

export default page