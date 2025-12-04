"use client";
import { useFetchResponse } from "@/types/useFetchUserResponse";
import { useQuery } from "@tanstack/react-query";

export const useFetchUsers = () => {
  return useQuery<useFetchResponse>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("failed to fetch users!");
      const data = await res.json();
      return data;
    },
    staleTime: 5*60 * 1000
  });
};
