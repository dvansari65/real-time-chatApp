"use client";
import React, { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { removeUsers } from "@/features/Redux/NewGroupMembersSlice";
import { useAuth } from "@/contextApi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user";
import { useCreateGroup } from "@/hooks/useCreateGroup";

interface GiveNameToTheGroupProps {
  className: string;
  isOpen: boolean;
  backToPreviousModal: () => void;
  handleCreateGroup: () => void;
  GroupMembers: (Partial<User> | undefined)[];
  isPending: boolean;
  setGroupName: (value: React.SetStateAction<string>) => void;
  groupName: string;
  discription: string;
  setDiscription: (value: React.SetStateAction<string>) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NewGroupModal = ({
  className,
  backToPreviousModal,
  isOpen,
  GroupMembers,
  isPending,
  setGroupName,
  groupName,
  setDiscription,
  discription,
  handleAvatarChange,
  handleCreateGroup
}: GiveNameToTheGroupProps) => {
  if (!isOpen) return;
  const dispatch = useDispatch();
  // const createGroupInputs: createGroupInput = {
  //   admins: [data?.user!],
  //   GroupMembers: groupMembersAfterAddingCurrentUser,
  //   userId: data.user?.id!,
  //   name: groupName,
  //   profileImage: avatar || null,
  //   discription,
  // };
  const removerSelectedUsers = (id: number) => {
    dispatch(removeUsers(id));
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
          aria-disabled = {isPending}
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
        <div className="flex items-start gap-3 flex-col space-x-4">
          {/* Camera Icon */}
          <div className="relative">
            <input
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Upload Avatar
            </label>
          </div>
          {/* Group Name Input */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full focus:border-blue-500 border border-gray-500 text-lg bg-transparent placeholder-gray-500 text-black focus:outline-none"
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
                key={member?.id}
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
