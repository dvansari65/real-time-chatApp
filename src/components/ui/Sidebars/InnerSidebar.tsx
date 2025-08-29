"use client";
import {
  MessageCircle,
} from "lucide-react";

import { useCallback, useState } from "react";
import { useAuth } from "@/contextApi";
import { UserListSkeleton } from "../Skeleton";
import { Button } from "../Button";
import SelectUserForNewGroup from "@/components/NewGroup/SelectUserForNewGroup";
import NewGroupModal from "@/components/NewGroup/GiveNameToTheGroup";
import SearchBar from "@/components/SearchBar";
import { useGetAllChats } from "@/lib/api/useGetAllChats";
import UserItem from "../UserItem";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {  storeMessages, storeUser } from "@/features/Redux/allChatsSlice";
import RedirectPage from "@/app/(protected)/Redirecting/page";

export default function InnerSidebar() {
  const router = useRouter()
  const dispatch = useDispatch()
  
  const [selectUserModal, setSelectUserModal] = useState<boolean>(false);
  const [giveNameToNewGroupModal, setGiveNameToNewGroupModal] = useState(false);
  const { data } = useAuth();
  const user = data?.user;
  const {
    data: allChatsData,
    isLoading: allChatsDataLoading,
    isError,
  } = useGetAllChats();
  const handleProceedAction = useCallback(() => {
    console.log("Proceed action called!");
    setGiveNameToNewGroupModal(true);
    setSelectUserModal(false);
  }, []);

  const handleBackToPreviousModal = () => {
    setSelectUserModal(true);
    setGiveNameToNewGroupModal(false);
  };

  const handleNavigation = (chatId:number) => {
    const filteredChats = allChatsData?.chats.find(chat=>Number(chat?.id) === chatId)
    const userMember = filteredChats?.members?.find(member=>member?.user?.id !== user?.id)
    const filteredUser = userMember?.user || {}
    const filteredMessages = filteredChats?.messages || []
    dispatch(storeMessages(filteredMessages ))
    dispatch(storeUser(filteredUser))
    console.log("filtered chats ",filteredChats);
    console.log("filtered user",filteredUser);
    router.push(`/ExistedChat/${chatId}`)
  };
  
  return (
    <div className="w-[320px] bg-gray-900/95 backdrop-blur-xl border-r border-white/10 flex flex-col h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      {/* Search */}
      <SearchBar />

      {/* Quick Actions */}
      <div className="relative z-10 p-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2 text-white cursor-pointer hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 backdrop-blur-sm group">
            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <Button className="text-sm font-medium bg-transparent border-none p-0 text-white hover:bg-transparent">
              New Chat
            </Button>
          </div>
          <Button
            onClick={() => setSelectUserModal(true)}
            className="text-sm font-medium text-white cursor-pointer  px-4 py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-sm group bg-transparent hover:bg-white/10"
          >
            <span className="group-hover:scale-105 transition-transform duration-300">
              New Group
            </span>
          </Button>
        </div>
      </div>

      {/* Navigation Links */}
      {selectUserModal && (
        <SelectUserForNewGroup
          proceedAction={handleProceedAction}
          className={`relative`}
          isOpen={selectUserModal}
          onClose={() => setSelectUserModal(false)}
          // users={filteredUsers}
        />
      )}

      {giveNameToNewGroupModal && (
        <NewGroupModal
          className="relative"
          isOpen={giveNameToNewGroupModal}
          backToPreviousModal={handleBackToPreviousModal}
        />
      )}
      {!selectUserModal && !giveNameToNewGroupModal ? (
        allChatsDataLoading ? (
          <div className="p-4">
            <UserListSkeleton />
          </div>
        ) : (
          <div className="px-2">
            {allChatsData?.chats?.map((chat) => (
              <button
                onClick={()=>handleNavigation(Number(chat?.id))}
                key={chat?.id}
                className="w-full flex flex-col mb-2  mt-2 group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <UserItem users={chat?.members} />
              </button>
            ))}
          </div>
        )
      ) : null}

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
    </div>
  );
}
