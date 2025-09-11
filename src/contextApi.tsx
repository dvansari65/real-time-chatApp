"use client";
import React, { createContext, useContext } from "react";
import { meResponseProps } from "./types/user";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { NextResponse } from "next/server";

type authContextTypes = {
  data: meResponseProps;
  logout: () => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<meResponseProps, Error>>;
};

const AuthContext = createContext<authContextTypes | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { isLoading, data, refetch, isError, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (!response.ok) {
        return NextResponse.json(
          {
            message: data?.message || "failed to fetch user data!",
          },
          { status: 500 }
        );
      }
      return data;
    },
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      console.log("res", res);
      const data = await res.json();
      console.log("data", data);
      if (!res.ok) {
        toast.error(data.message);
        throw new Error(`Logout failed with status ${res.status}`);
      }
      queryClient.clear();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Failed to logout from console!", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ data, isLoading, isError, logout, error, refetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
