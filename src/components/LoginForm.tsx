"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginProps } from "@/types/user";
import { Input } from "./ui/input";
import { Button } from "./ui/Button";
import Link from "next/link";
import { useAuth } from "@/contextApi";
import {  useQueryClient } from "@tanstack/react-query";

function LoginForm() {
  const [formData, setFormData] = useState<loginProps>({
    email: "",
    password: "",
  });
  const queryClient = useQueryClient()
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { refetch } = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setSuccess("");
    if (!formData.email || !formData.password) {
      setError("please provide atleast one identifier!");
      setSuccess("");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "something went wrong!");
        setIsLoading(false);
        return;
      }
      await refetch();
      queryClient.invalidateQueries({queryKey:["getAllChats"]})
      queryClient.invalidateQueries({queryKey:["users"]})
      queryClient.invalidateQueries({queryKey:["currentUser"]})
      setError("");
      setSuccess("logged in successfully");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      setError(error.Error || "server error!");
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <main className="w-full h-screen bg-slate-200 flex justify-center items-center">
      <div className="w-[500px] ">
        {error && (
          <span className="absolute w-full text-start left-[42%] top-[28%] bg-transparent border border-slate-200 text-red-400 py-2 px-3">
            {error}
          </span>
        )}
        {success && (
          <span className="absolute left-[42%] top-[35%] bg-transparent border border-slate-200 text-green-500 py-2 px-3">
            {success}
          </span>
        )}
        <form
          onSubmit={handleSubmit}
          className=" w-full p-5 rounded-2xl border border-gray-300 flex justify-center items-center flex-col gap-3 "
        >
          <span className="relative text-slate-500 text-3xl">LOGIN</span>
          <Input
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="enter gmail.."
            className="text-gray-700"
          />
          <Input
            name="password"
            type="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="enter password..."
            className="text-gray-700"
          />
          <div>
            <Button disabled={isLoading === true} type="submit">
              {" "}
              {isLoading ? "LOGIN..." : "LOGIN"}
            </Button>
            <Link
              className="text-blue-500 hover:cursor-pointer ml-2 border border-blue-400 px-1 rounded-[3px] py-[1px]"
              href="/signup"
            >
              signup
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default LoginForm;
