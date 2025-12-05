// hooks/useUpdateUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface UpdateUserData {
  username?: string;
  email?: string;
  phoneNumber?: number;
  bio?: string;
  avatar?: string;
}

export interface UpdateUserResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    phoneNumber: string | null;
    avatar: string | null;
    bio: string | null;
    isOnline: boolean;
    lastSeen: Date;
    createdAt: Date;
  };
}

const updateUserAPI = async (
  userId: number,
  data: UpdateUserData
): Promise<UpdateUserResponse> => {
  try {
    const convertedId = String(userId)
    const response = await fetch(`/api/user/${convertedId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update user");
    }
  
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const useUpdateUser = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserData) => updateUserAPI(userId, data),
  });
};