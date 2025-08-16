import { partialUser, User } from "@/types/user";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";

interface newGroupProps {
  isOpen: boolean;
  onCloce: () => void;
  proceedAction: () => void;
  users: partialUser[];
  className?: string;
}

function SelectUserForNewGroup({
  isOpen,
  onCloce,
  proceedAction,
  users,
  className,
}: newGroupProps) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  if (!isOpen) return null;
  const handleSelectUsers = (id: number) => {
    setSelectedUsers((prev) =>
      selectedUsers.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id]
    );
  };

  return (
    <div
      className={`fixed inset-0  h-[100%] max-w-[330px] bg-slate-100 overflow-y-auto  ${className}`}
    >
      <div className="flex flex-col gap-3 w-full h-screen">
        <div className="flex flex-row justify-between items-center px-2 py-1 ">
          <button onClick={onCloce}>
            <ArrowLeft size={15} />
          </button>
          <div className="text-black font-bold">Add Members</div>
          <button disabled={selectedUsers.length === 0} onClick={proceedAction} className={ selectedUsers.length === 0 ? `text-gray-500` : `text-green-500`}>
            Next
          </button>
        </div>
        <div>
          {users.map((user) => (
            <div
              key={user?.id}
              className="flex flex-row justify-between px-2 border-b border-gray-300 mx-2 py-1 "
            >
              <div className="flex justify-start items-center gap-2 px-1">
                <img className="size-13 rounded-[50%] " src={user?.avatar} />
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
  );
}

export default SelectUserForNewGroup;
