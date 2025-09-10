import { singleUserDataResponse } from "@/types/user"
import { useQuery } from "@tanstack/react-query"
import { NextResponse } from "next/server"
import { toast } from "sonner"



export const useSingleUser = (userId: number) => {
    return useQuery<singleUserDataResponse>({
        queryKey: ["user", userId],
        queryFn: async () => {
            const res = await fetch(`/api/user`, {
                method: "GET",
                credentials: "include",
                body:JSON.stringify(userId)
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || data.error || "Failed to get user!");
                throw new Error(data.message || "Request failed"); // <-- important for react-query
            }

            return data;
        },
        staleTime: 20 * 60 * 1000, // <-- staleTime expects milliseconds, not seconds
    });
};
