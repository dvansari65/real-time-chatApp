"use client";
import React, { useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/Button";
import { loginProps } from "../../../../types/user";

function Page() {
  const [formData, setFormData] = useState<loginProps>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    setError("");
    setIsLoading(false);
    if (!formData.email || !formData.password) {
      setError("please provide atleast one identifier!");
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
      console.log("result",result);
      
      if (!response.ok) {
        setError(result.Error || "something went wrong!");
        setIsLoading(false);
        return;
      }
      setIsLoading(false)
      setError("")
      setSuccess("logged in successfully")
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
      <div className="w-[500px]">
      <form className="w-full p-5 rounded-2xl border border-gray-300 flex justify-center items-center flex-col gap-3 ">
        <span className="text-slate-500 text-3xl">LOGIN</span>
        <Input
          onSubmit={handleSubmit}
          name="email"
          type="email"
          onChange={handleChange}
          value={formData.email}
          placeholder="enter gmail.."
        />
        <Input
        name="password"
          type='"password'
          onChange={handleChange}
          value={formData.password}
          placeholder="enter password..."
        />
        <Button type="submit" >
         {
          isLoading ? "LOGIN..." : "LOGIN"
         }
        </Button>
      </form>
      </div>
    </div>
  );
}

export default Page;
