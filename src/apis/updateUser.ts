// hooks/useUpdateUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const response = await fetch(`/api/user/${userId}`, {
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
};

export const useUpdateUser = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserData) => updateUserAPI(userId, data),
    onSuccess: (response) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      
      // Optional: Update the cache directly for immediate UI update
      queryClient.setQueryData(["user", userId], response.user);
    },
    onError: (error: Error) => {
      console.error("Error updating user:", error);
    },
  });
};