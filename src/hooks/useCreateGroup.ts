"use client";
import { useAuth } from "@/contextApi";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { CreateGroup } from "@/apis/api/createGroup";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateGroupProps {
  avatar: File | null;
  groupName: string;
  discription: string;
}

export const useCreateGroup = () => {
  const { data } = useAuth();
  const { GroupMembers } = useSelector((state: RootState) => state.NewGroup);
  const groupMembersWithCurrentUser = [...GroupMembers, data?.user!];
  const { mutateAsync, isPending,error } = CreateGroup();
  const queryClient = useQueryClient();
  const createGroup = async ({
    avatar,
    groupName,
    discription,
  }: CreateGroupProps) => {
    if (!groupName.trim()) {
      toast.error("Please provide a group name!");
      return;
    }

    if (GroupMembers.length === 0) {
      toast.error("Please add at least one member!");
      return;
    }

    try {
      const formData = new FormData();
      if (avatar) {
        formData.append("profileImage", avatar);
      }
      formData.append(
        "data",
        JSON.stringify({
          admins: [data?.user!],
          GroupMembers: groupMembersWithCurrentUser,
          userId: data.user?.id!,
          name: groupName,
          profileImage: avatar || null,
          discription,
        })
      );
      const responseData = await mutateAsync(formData);
      queryClient.invalidateQueries({ queryKey: ["getAllChats"] });
      toast.success("Group successfully created!");
      console.log("Success!", responseData);
      return responseData
    } catch (error) {
      console.error("failed to create group!", error);
      throw error;
    }
  };

  return {
    createGroup,
    isCreatingGroup: isPending,
    createGroupError:error
  };
};
