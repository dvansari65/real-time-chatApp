"use client"
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useCreateChat } from "./useCreateChat";
import { useCreateChatForGroup } from "./useCreateChatForGroup";
import { useCallback } from "react";
import { setLoading } from "@/features/Redux/loadingSlice";
import { createdChatReponse, userFromChat } from "@/types/chat";
import { toast } from "sonner";
import { setGroupId } from "@/features/Redux/groupDataSlice";
import { useRouter } from "next/navigation";

export function useChatOperations() {
    const router = useRouter();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
  
    const { mutate: createChatBetweenOneToOneMutation, isPending: isOneToOnePending } = useCreateChat();
    const { mutate: createGroupChatMutation, isPending: isGroupPending } = useCreateChatForGroup();
  
    // One-to-One Chat Creation
    const createChatforOneToOneUser = useCallback(
      (userId: number) => {
        dispatch(setLoading(true));
        
        createChatBetweenOneToOneMutation(userId, {
          onSuccess: (data: createdChatReponse) => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            
            if (data?.chat?.id) {
              toast.success("Chat created successfully!");
              router.push(`/chat/${data.chat.id}?userId=${userId}`);
            } else {
              toast.error("Please provide chat ID!");
            }
            
            dispatch(setLoading(false));
          },
          onError: (error) => {
            dispatch(setLoading(false));
            toast.error(error.message);
          },
        });
      },
      [createChatBetweenOneToOneMutation, dispatch, queryClient, router]
    );
  
    // Group Chat Creation
    const createChatForGroup = useCallback(
      (
        isGroup: boolean,
        name: string | undefined,
        members: userFromChat[] | undefined,
        description?: string,
        groupId?: string | undefined
      ) => {
        // Validation
        if (!isGroup || !name || !members || members.length === 0) {
          toast.error("Please provide all the fields!");
          return;
        }
  
        dispatch(setLoading(true));
  
        const payload = {
          isGroup,
          name,
          members,
          description,
          groupId,
        };
  
        createGroupChatMutation(payload, {
          onSuccess: (data) => {
            if (!data?.chat?.isGroup) {
              toast.error("Select group to create chat!");
              dispatch(setLoading(false));
              return;
            }
  
            queryClient.invalidateQueries({ queryKey: ["getAllChats"] });
  
            if (data?.chat?.id) {
              toast.success("Chat created successfully!");
              dispatch(setGroupId(data.chat.groupId));
              router.push(`/GroupChat/${data.chat.id}?groupId=${data.chat.groupId}`);
            }
            
            dispatch(setLoading(false));
          },
          onError: (error) => {
            dispatch(setLoading(false));
            toast.error(error.message);
            console.error("Group chat creation error:", error);
          },
        });
      },
      [createGroupChatMutation, dispatch, queryClient, router]
    );
  
    return {
      createChatforOneToOneUser,
      createChatForGroup,
      isOneToOnePending,
      isGroupPending,
    };
  }