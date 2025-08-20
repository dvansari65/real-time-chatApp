"use client";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/contextApi";
import { useChatCreation } from "@/hooks/useCreateChat";
import { RootState } from "@/lib/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import RedirectPage from "./Redirecting/page";


export default function Home() {
  const { data, isLoading } = useAuth();
  const {isLoading:chatCreationLaoding} = useSelector((state:RootState)=>state.Loading)
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader/>
      </div>
    );
  }

  if (!data?.user) {
    return null; // Briefly shows nothing while redirecting
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome, {data?.user?.username}!</h1>
      {/* Your main dashboard/content */}
      {
        chatCreationLaoding && <RedirectPage/>
      }
    </div>
  );
}
