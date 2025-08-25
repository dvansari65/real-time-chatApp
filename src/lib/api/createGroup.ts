
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateGroup = () => {
  return useMutation({
    mutationKey: ["newGroup"],
    mutationFn: async (formData:FormData) => {
      const response = await fetch("/api/group", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = "failed to create group!";
        
        try {
          const errorData = await response.json();
          errorMessage = errorData?.error || errorData?.message || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, try to get text response
          try {
            const textResponse = await response.text();
            errorMessage = textResponse || errorMessage;
          } catch (textError) {
            // If all fails, use status text
            errorMessage = response.statusText || errorMessage;
          }
        }
        
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      console.log("data", data);
      return data;
    },
  });
};
