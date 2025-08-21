import { partialUser, User } from "@/types/user";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import NewGroupAddedUserCard from "./NewGroupAddedUserCard";
import { useDispatch } from "react-redux";
import { setGroupMembers } from "@/features/Redux/NewGroupMembersSlice";

interface newGroupProps {
  isOpen: boolean;
  onClose: () => void;
  users: partialUser[];
  className?: string;
  proceedAction : ()=>void
}

function SelectUserForNewGroup({
  isOpen,
  onClose,
  users,
  className,
  proceedAction
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
  useEffect(()=>{
    console.log("user got set to global state..");
    dispatch(setGroupMembers(addedUsers))
  },[addedUsers,addedUsers.length])

  return (
    <div
      className={`fixed inset-0 z-50 h-[100%] max-w-[330px] bg-slate-100 overflow-y-auto scrollbar-hide
        transition-transform duration-300 ease-in-out ${
          isOpen ? `translate-x-0` : `-translate-x-full`
        }
          ${className}`}
    >
      <div className="flex flex-col gap-3 w-full h-screen">
        <div className="flex flex-row justify-between items-center px-2 py-1 ">
          <button onClick={onClose}>
            <ArrowLeft size={15} />
          </button>
          <div className="text-black font-bold">Add Members</div>

          <button
            disabled={selectedUsers.length === 0}
            onClick={proceedAction}
            className={
              selectedUsers.length === 0 ? `text-gray-500` : `text-green-500`
            }
          >
            Next
          </button>
        </div>
        <div className="flex flex-col justify-start gap-3 ">
          <NewGroupAddedUserCard
            addedUsers={addedUsers}
            onRemoveUser={handleRemoveUser}
          />
          <div className="bg-gray-100 p-2">
            {users.map((user) => (
              <div
                key={user?.id}
                className="flex flex-row justify-between px-2 border-b border-gray-300 mx-2 py-1 mb-2 "
              >
                <div className="flex justify-start items-center gap-2 px-1">
                  <img
                    className="size-13 rounded-[50%] mb-3"
                    src={user?.avatar}
                  />
                  <span>{user?.username}</span>
                </div>
                <div className=" flex justify-center items-center">
                  <input
                    checked={selectedUsers?.includes(Number(user?.id))}
                    type="checkbox"
                    onChange={() => handleSelectUsers(Number(user?.id))}
                    className="w-4 h-4 bg-gray-200 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectUserForNewGroup;
