"use client";
import React, { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/Button";
import { loginProps } from "../../../types/user";
import { useRouter } from "next/navigation";


function Login() {
  const [formData, setFormData] = useState<loginProps>({
    email: "",
    password: "",
  });
  const router = useRouter()
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setSuccess("")
    if (!formData.email || !formData.password) {
      setError("please provide atleast one identifier!");
      setSuccess("")
      setIsLoading(false)
      return;
    }
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "something went wrong!");
        setIsLoading(false);
        return;
      }
      setError("");
      setSuccess("logged in successfully");
      router.push("/")
    } catch (error: any) {
      console.error("failed to login!", error);
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
    <div className="w-full h-screen bg-slate-200 flex justify-center items-center">
      <div className="w-[500px] ">
      {error && (
            <span className="absolute left-[43%] top-[35%] bg-transparent border border-slate-200 text-red-400 py-2 px-3">
              {error}
            </span>
          )}
          {success && (
            <span className="absolute left-[43%] top-[35%] bg-transparent border border-slate-200 text-green-500 py-2 px-3">
              {success}
            </span>
          )}
        <form
          onSubmit={handleSubmit}
          className="relative w-full p-5 rounded-2xl border border-gray-300 flex justify-center items-center flex-col gap-3 "
        >

          <span className="text-slate-500 text-3xl">LOGIN</span>
          <Input
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="enter gmail.."
          />
          <Input
            name="password"
            type='password'
            onChange={handleChange}
            value={formData.password}
            placeholder="enter password..."
          />
          <Button disabled={isLoading === true} type="submit"> {isLoading ? "LOGIN..." : "LOGIN"}</Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
