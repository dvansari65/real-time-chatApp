interface GiveNameToTheGroupProps {
  className: string;
  isOpen: boolean;
  backToPreviousModal: () => void;
}

import React, { useState } from "react";
import { Camera, X, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { removeUsers } from "@/features/Redux/NewGroupMembersSlice";
import {
  createGroupInput,
  createGroupInputTypesForFrontend,
} from "@/types/CreateGroup";
import { useAuth } from "@/contextApi";

const NewGroupModal = ({
  className,
  backToPreviousModal,
  isOpen,
}: GiveNameToTheGroupProps) => {
  const { data } = useAuth();
  const { GroupMembers } = useSelector((state: RootState) => state.NewGroup);
  const [error, setError] = useState("");
  if (!isOpen) return;
  const [groupName, setGroupName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [discription, setDiscription] = useState("");
  const [disappearingMessages, setDisappearingMessages] = useState("Off");
  const dispatch = useDispatch();
  const createGroupInputs: createGroupInputTypesForFrontend = {
    admins: [data?.user!],
    GroupMembers,
    userId: data?.user?.id,
    name: groupName,
    profileImage: avatar || null,
    discription,
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
  };
  const removerSelectedUsers = (id: number) => {
    if (id) {
      dispatch(removeUsers(id));
      return;
    }
    setError("please select the id to remove the user!");
  };
  const handleCreateGroup = async () => {
    try {
    } catch (error) {}
  };
  return (
    <div
      className={`fixed inset-0 z-50 bg-white max-w-md mx-auto min-h-screen flex flex-col ${className}`}
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
          disabled={!groupName.trim() && GroupMembers.length === 0}
        >
          Create
        </button>
      </div>

      {/* Group Info Section */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex items-center space-x-4">
          {/* Camera Icon */}
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <input type="file" onChange={handleAvatarChange}>
              <Camera />
            </input>
          </div>

          {/* Group Name Input */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Group name (optional)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full text-lg border-none outline-none bg-transparent placeholder-gray-500"
            />
            <div className="h-px bg-green-600 mt-2"></div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white">
        {/* Disappearing Messages */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-lg text-gray-800">Disappearing messages</span>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">{disappearingMessages}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
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
