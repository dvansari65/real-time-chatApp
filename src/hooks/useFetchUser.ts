"use client";

import { useFetchResponse } from "@/lib/api/useFetchUserResponse";
import { User } from "@/types/user";
import { useState } from "react";

interface returnType  {
    loading:boolean,
    error:string,
    fetchUsers: ()=>Promise<void>
    data : useFetchResponse | null
}

export const useFetchUsers =  ():returnType => {
  const [data, setData] = useState<useFetchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchUsers = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        credentials: "include",
      });
      const data = await res.json();
      console.log("data",data);
      
      if (!res.ok) {
        setError(data.error || "something went wrong!");
        setLoading(false);
        return;
      }
      if (data === null) {
        setError("response not found!");
        setLoading(false);
        setData(null);
      }
      setData(data);
      setError("");
    } catch (error: any) {
      setError(error.data.message || error.message || "server error!");
      console.log("server error", error);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetchUsers };
};
