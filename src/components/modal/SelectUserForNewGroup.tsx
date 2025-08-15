import { User } from "@/types/user";
import { ArrowLeft } from "lucide-react";
import React from "react";

interface newGroupProps {
  isOpen: boolean;
  onCloce: () => void;
  proceedAction: () => void;
  users: User[];
}

function SelectUserForNewGroup({
  isOpen,
  onCloce,
  proceedAction,
  users,
}: newGroupProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 h-screen max-h-[400px] bg-slate-200 ">
      <div className="flex flex-col gap-3 w-full h-screen">
        <div className="flex flex-row justify-between items-center px-2 py-1 ">
          <button onClick={onCloce}>
            <ArrowLeft size={15} />
          </button>
          <div className="text-black font-bold">Add Members</div>
          <button onClick={proceedAction} className="text-green-500">
            Next
          </button>
        </div>
        <div>
            <select name="" id="">
                {
                    users.map(user=>(
                       <div key={user?.id} className="flex flex-row justify-between px-2">
                        <div className="flex justify-start items-center gap-2 px-1">
                            <img className="size-16 rounded-[50%] " src={user?.avatar}  />
                            <span>{user?.username}</span>
                        </div>
                        <div>
                            <input type="checkbox" onChange={} />
                        </div>
                       </div>
                    ))
                }
            </select>
        </div>
      </div>
    </div>
  );
}

export default SelectUserForNewGroup;
