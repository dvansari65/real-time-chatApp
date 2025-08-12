"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { meResponseProps, User } from "./types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type authContextTypes = {
  data: meResponseProps;
  logout: () => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

const AuthContext = createContext<authContextTypes | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { isLoading, data, refetch, isError, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      if (!response.ok) throw new Error("fialed to fetch user!");
      return response.json();
    },
  });
  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      console.log("res", res);
      if (!res.ok) {
        throw new Error(`Logout failed with status ${res.status}`);
      }
      await queryClient.invalidateQueries();
      await refetch();
      queryClient.clear()
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Failed to logout from console!", error);
    }
  };

  return (
    <AuthContext.Provider value={{ data, isLoading, isError, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
