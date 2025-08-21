interface GiveNameToTheGroupProps {
  className: string;
  isOpen: boolean;
  backToPreviousModal: () => void;
}

import React, { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { removeUsers } from "@/features/Redux/NewGroupMembersSlice";
import { createGroupInput } from "@/types/CreateGroup";
import { useAuth } from "@/contextApi";
import { useCreateGroup } from "@/lib/api/createGroup";
import { toast } from "sonner";
import { partialUser } from "@/types/user";

const NewGroupModal = ({
  className,
  backToPreviousModal,
  isOpen,
}: GiveNameToTheGroupProps) => {
  const { data } = useAuth();
  const { GroupMembers } = useSelector((state: RootState) => state.NewGroup);
  if (!isOpen) return;
  const [groupName, setGroupName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [discription, setDiscription] = useState("");
  const dispatch = useDispatch();
  const groupMembersAfterAddingCurrentUser = [...GroupMembers, data?.user!];
  // const createGroupInputs: createGroupInput = {
  //   admins: [data?.user!],
  //   GroupMembers: groupMembersAfterAddingCurrentUser,
  //   userId: data.user?.id!,
  //   name: groupName,
  //   profileImage: avatar || null,
  //   discription,
  // };
  const { mutate, isPending } = useCreateGroup();
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
  };
  const removerSelectedUsers = (id: number) => {
    dispatch(removeUsers(id));
  };
  const handleCreateGroup = () => {
    try {
      const formData = new FormData();
      if (avatar) {
        formData.append("profileImage", avatar);
      }
      formData.append(
        "data",
        JSON.stringify({
          admins: [data?.user!],
          GroupMembers: groupMembersAfterAddingCurrentUser,
          userId: data.user?.id!,
          name: groupName,
          profileImage: avatar || null,
          discription,
        })
      );
      mutate(formData, {
        onSuccess: (data) => {
          console.log("Success!", data);
          toast.success("Group successfully created!");
        },
        onError: (error) => {
          toast.error(error.message || "failed to create group!");
          console.error("failed to create group!", error);
        },
      });
    } catch (error) {
      console.error("failed to create group!", error);
      throw error;
    }
  };
  return (
    <div
      className={`fixed inset-0 z-50 h-[100%] max-w-[330px] bg-slate-100 overflow-y-auto flex flex-col   ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <button
          onClick={backToPreviousModal}
          className="text-green-600 font-medium text-lg"
        >
          Back
        </button>
        <h1 className="text-xl font-medium text-gray-800">New group</h1>
        <button
          onClick={handleCreateGroup}
          className={`font-medium text-lg ${
            groupName.trim() || GroupMembers?.length > 0
              ? "text-green-600"
              : "text-gray-400"
          }`}
          disabled={
            (!groupName.trim() && GroupMembers.length === 0) || isPending
          }
        >
          {isPending ? "Creating..." : "Create"}
        </button>
      </div>

      {/* Group Info Section */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex items-center space-x-4">
          {/* Camera Icon */}
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {/* The label acts as the clickable camera icon area */}
            <label htmlFor="avatar-upload" className="cursor-pointer">
              {/* The actual file input is hidden */}
              <input
                id="avatar-upload"
                type="file"
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*" // Optional: ensures only images can be selected
              />
              <svg
                className="w-8 h-8 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.437 4h3.126a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </label>
          </div>
          {/* Group Name Input */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Group name (optional)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full text-lg border-none outline-none bg-transparent placeholder-gray-500 "
            />
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white">
        {/* Disappearing Messages */}
        <div className="flex flex-col items-start justify-start p-4 border-b border-gray-100">
          <textarea
            name="discription"
            placeholder="description...."
            value={discription}
            onChange={(e) => setDiscription(e.target.value)}
            className="w-full h-40 px-2"
          ></textarea>
        </div>
        {/* Group Permissions */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-lg text-gray-800">Group permissions</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Members Section */}
      <div className="flex-1 bg-white mt-4">
        <div className="px-4 py-2">
          <span className="text-sm text-gray-500 font-medium">
            MEMBERS: {GroupMembers?.length} OF 1,023
          </span>
        </div>

        {/* Members List */}
        <div className="px-4 py-2">
          <div className="flex flex-wrap gap-4">
            {GroupMembers?.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center relative"
              >
                {/* Avatar with Remove Button */}
                <div className="relative">
                  <img
                    src={member?.avatar}
                    className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center text-white text-2xl"
                  />
                  <button
                    onClick={() => removerSelectedUsers(Number(member?.id))}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
                {/* Member Name */}
                <span className="text-sm text-gray-700 mt-2 text-center">
                  {member?.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGroupModal;
