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
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contextApi";
import { toast } from "sonner";
import { UserListSkeleton } from "../Skeleton";
import { useChatCreation } from "@/hooks/useCreateChat";
import { UserListItem } from "../UserListItems";
import { Button } from "../Button";
import SelectUserForNewGroup from "@/components/modal/SelectUserForNewGroup";

export default function InnerSidebar() {
  const [selectUserModal, setSelectUserModal] = useState<boolean>(false);
  const [chatError, setChatError] = useState("");
  const { data} = useAuth();
  const user = data?.user;
  const {
    data: useFetchData,
    isLoading: fetchUsersLoading,
    error,
    refetch
  } = useFetchUsers();

  useEffect(()=>{
    if(user?.id || !useFetchData || !fetchUsersLoading){
      refetch?.()
    }
  },[user?.id, useFetchData, fetchUsersLoading , refetch])

  const filteredUsers = useMemo(() => {
    if (!useFetchData?.users || !user?.id) return [];
    return useFetchData.users.filter((u) => Number(u.id) !== Number(user.id));
  }, [useFetchData?.users, user?.id]);
  //
  const { createChat, isCreatingChat } = useChatCreation();
  if (error) return toast.error(error.message || "something went wrong!");
  if (chatError) return toast.error(chatError);
  return (
    <div className="w-[320px] bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
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
            <Button className="text-sm font-medium">New Chat</Button>
          </div>
          <Button
              onClick={() => setSelectUserModal(true)}
              className="text-sm font-medium text-green-600 cursor-pointer hover:bg-green-50 px-3 py-2 rounded-lg"
            >
              New Group
            </Button>
        </div>
      </div>

      {/* Navigation Links */}
      {selectUserModal && (
        <SelectUserForNewGroup
          className= {`relative `}
          isOpen={selectUserModal}
          onClose={() => setSelectUserModal(false)}
          proceedAction={() => {}}
          users={filteredUsers}
        />
      )}
      {!selectUserModal && (
        <div className="flex-1 overflow-y-auto">
          {fetchUsersLoading ? (
            <UserListSkeleton />
          ) : (
            <div className="p-2 space-y-2 absolute">
              {filteredUsers?.map((user) => (
                <UserListItem
                  key={user?.id}
                  isCreatingChat={isCreatingChat}
                  onChatCreate={createChat}
                  user={user}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
