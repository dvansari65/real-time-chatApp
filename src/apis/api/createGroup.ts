import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const CreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["newGroup"],
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/group", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        let errorMessage = "failed to create group!";
        try {
          const errorData = await response.json();
          errorMessage = errorData?.error || errorData?.message || errorMessage;
        } catch (jsonError) {
          try {
            const textResponse = await response.text();
            errorMessage = textResponse || errorMessage;
          } catch (textError) {
            errorMessage = response.statusText || errorMessage;
          }
        }
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      console.log("data", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllChats"] });
    },
  });
};
