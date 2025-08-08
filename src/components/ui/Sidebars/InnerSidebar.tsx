"use client";
import Users from "../../Users";
import {
  MessageCircle,
  Settings,
  Phone,
  Video,
  Archive,
  Star,
  UserPlus,
  Search,
  LoaderIcon,
} from "lucide-react";
import { useFetchUsers } from "@/hooks/useFetchUser";
import { useEffect, useState } from "react";
import { useAuth } from "@/contextApi";


export default function InnerSidebar() {
  const [chatError,setChatError] = useState("")
  const { loading:fetchUsersLoading, error, fetchUsers, data } = useFetchUsers();
  const {user,loading:authLoading} = useAuth()
  useEffect(() => {
    if (error) return;
    if (!fetchUsersLoading) {
      fetchUsers();
    }
    console.log("data", data);
  }, []);
  const handleChatCreation = async (userId:number)=>{
    if(authLoading || fetchUsersLoading) return;
    try {
      const res = await fetch("/api/chat",{
        method:"POST",
        credentials:"include",
        body:JSON.stringify(
          {
            userId1:Number(user?.id),
            userId2:userId
          }
        )
      })
      console.log("res:",res)
      const data = await res.json()
      console.log("data",data);
      
      if(!res.ok){
        setChatError(data.error || "something went wrong!")
        return;
      }
      const id = data?.chat?.id
      if(id){
        window.location.href = `/chat/${id}`
      }
    } catch (error) {
      
    }
  }
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 bg-green-600 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">WhatsApp</h1>
          <div className="flex space-x-3">
            <UserPlus className="w-5 h-5 cursor-pointer hover:bg-green-700 rounded p-1" />
            <Settings className="w-5 h-5 cursor-pointer hover:bg-green-700 rounded p-1" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 bg-white border-b">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 bg-white border-b">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2 text-green-600 cursor-pointer hover:bg-green-50 px-3 py-2 rounded-lg">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">New Chat</span>
          </div>
          <div className="flex items-center space-x-2 text-green-600 cursor-pointer hover:bg-green-50 px-3 py-2 rounded-lg">
            {/* <Users className ="w-4 h-4" /> */}
            <span className="text-sm font-medium">New Group</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto">
        {/* Recent Chats Header */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-start gap-2 items-center">
          <MessageCircle />
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Users
          </h3>
        </div>

        {fetchUsersLoading ? (
          <LoaderIcon />
        ) : data ? (
          <div className="p-2 space-y-2">
            {data?.users?.map((i) => (
              <button
                onClick={()=>handleChatCreation(Number(i.id))}
                key={i.id}
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <Users
                  avatar={i?.avatar}
                  isOnline={i?.isOnline}
                  username={i?.username}
                  id={i?.id}
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center">no users found!</div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">ME</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">My Profile</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
          <Settings className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
        </div>
      </div>
    </div>
  );
}
