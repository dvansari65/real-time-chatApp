"use client";
import Users from "../../Users";
import {
  MessageCircle,
  Settings,
  UserPlus,
  Search,
  LoaderIcon,
} from "lucide-react";
import { useFetchUsers } from "@/lib/api/useFetchUser";
import {  useState } from "react";
import { useAuth } from "@/contextApi";
import { toast } from "sonner";
import { UserListSkeleton } from "../Skeleton";

export default function InnerSidebar() {
  const [chatError, setChatError] = useState("");
  const { data, isLoading: authLoading } = useAuth();
  const user = data?.user;
  const {
    data: useFetchData,
    isLoading: fetchUsersLoading,
    error,
  } = useFetchUsers();

  const handleChatCreation = async (userId: number) => {
    if (authLoading || fetchUsersLoading) return;
    if (!user) {
      setChatError("use is logged in!");
      return;
    }
    if (authLoading) return;
    if (!userId) {
      setChatError("please select a user for chatting!");
    }
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          userId1: Number(user?.id),
          userId2: userId,
        }),
      });
      console.log("res:", res);
      const data = await res.json();
      console.log("data", data);

      if (!res.ok) {
        setChatError(data.error || "something went wrong!");
        return;
      }
      const id = data?.chat?.id;
      console.log("chatid",id)
      if (id) {
        window.location.href = `/chat/${id}?with=${userId}`;
      }
    } catch (error) {
      console.log("failed to create chat!", error);
    }
  };
  if (error) return toast.error(error.message || "something went wrong!");
  if (chatError) return toast.error(chatError);
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
  
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
          <UserListSkeleton />
        ) : data ? (
          <div className="p-2 space-y-2">
            {useFetchData?.users
              ?.filter((i) => Number(i.id) !== Number(user?.id))
              ?.map((i) => (
                <button
                  onClick={() => handleChatCreation(Number(i.id))}
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
    </div>
  );
}
