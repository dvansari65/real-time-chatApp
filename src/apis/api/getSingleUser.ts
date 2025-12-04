import { singleUserDataResponse } from "@/types/user"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"



export const useGetSingleUser = (userId: number) => {
    return useQuery<singleUserDataResponse>({
        queryKey: ["user", userId],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/user/${userId}`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                console.log("data",data)
                if (!res.ok) {
                    throw new Error(data.message || "Request failed");
                }
                return data;
            } catch (error:any) {
                console.log("something went wrong",error)
                throw error;
            }
        },
        staleTime: 20 * 60 * 1000, 
    });
};
