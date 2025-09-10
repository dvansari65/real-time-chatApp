import { partialUser, User } from "@/types/user";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import NewGroupAddedUserCard from "./NewGroupAddedUserCard";
import { useDispatch } from "react-redux";
import { setGroupMembers } from "@/features/Redux/NewGroupMembersSlice";
import { useAuth } from "@/contextApi";

interface newGroupProps {
  isOpen: boolean;
  onClose: () => void;
  users: partialUser[] ;
  className?: string;
  proceedAction: () => void;
  currentUserId:number | undefined
}

function SelectUserForNewGroup({
  isOpen,
  onClose,
  users,
  className,
  proceedAction,
  currentUserId
}: newGroupProps) {
  const dispatch = useDispatch();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [addedUsers, setAddedUser] = useState<partialUser[]>([]);
  if (!isOpen) return null;
  const handleSelectUsers = (id: number) => {
    setSelectedUsers((prev) =>
      selectedUsers.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id]
    );
  };
  useEffect(() => {
    const addedUsers = selectedUsers.flatMap((i) => {
      return users.filter((user) => user?.id === i);
    });
    console.log("addedUsers", addedUsers);
    setAddedUser(addedUsers);
  }, [selectedUsers]);

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers((prev) => prev.filter((id) => id !== userId));
  };
  useEffect(() => {
    console.log("added users", addedUsers);
    dispatch(setGroupMembers(addedUsers));
  }, [addedUsers, addedUsers.length]);

  const filteredUsers = useMemo(()=>{
    return users.filter(user=>user?.id !== currentUserId)
  },[users,currentUserId])

  return (
    <div
      className={` inset-0 z-50 h-[100%] max-w-[330px] bg-gray-900/95 backdrop-blur-xl overflow-y-auto border-r border-white/10 relative
  transition-transform duration-300 ease-in-out ${
    isOpen ? `translate-x-0` : `-translate-x-full`
  }
  ${className}`}
    >
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

      <div className="relative z-10 flex flex-col gap-4 w-full h-screen">
        {/* Header */}
        <div className="flex flex-row justify-between items-center px-4 py-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 text-white hover:scale-105"
          >
            <ArrowLeft size={15} />
          </button>
          <div className="text-white font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Add Members
          </div>
          <button
            disabled={selectedUsers.length === 0}
            onClick={proceedAction}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
              selectedUsers.length === 0
                ? `text-gray-500 bg-gray-700/50 cursor-not-allowed`
                : `text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 shadow-lg hover:shadow-xl`
            }`}
          >
            Next
          </button>
        </div>

        <div className="flex flex-col justify-start gap-4 px-4">
          {/* Added Users Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <NewGroupAddedUserCard
              addedUsers={addedUsers}
              onRemoveUser={handleRemoveUser}
            />
          </div>

          {/* Users List */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="space-y-3">
              {filteredUsers?.map((user) => (
                <div
                  key={user?.id}
                  className="group flex flex-row justify-between items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex justify-start items-center gap-3">
                    <div className="relative">
                      <img
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20 group-hover:border-white/30 transition-all duration-300"
                        src={user?.avatar}
                        alt={user?.username}
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-white font-medium group-hover:text-blue-300 transition-colors duration-300">
                      {user?.username}
                    </span>
                  </div>

                  <div className="flex justify-center items-center">
                    <label className="relative cursor-pointer">
                      <input
                        checked={selectedUsers?.includes(Number(user?.id))}
                        type="checkbox"
                        onChange={() => handleSelectUsers(Number(user?.id))}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 transition-all duration-300 ${
                          selectedUsers?.includes(Number(user?.id))
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500"
                            : "border-white/30 bg-white/5 hover:border-white/50"
                        }`}
                      >
                        {selectedUsers?.includes(Number(user?.id)) && (
                          <svg
                            className="w-3 h-3 text-white m-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
    </div>
  );
}

export default SelectUserForNewGroup;
