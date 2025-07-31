"use client";
import React, { useState } from "react";
import {  RegisterProps } from "../../../../types/user";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "../../../../components/ui/Loader";

function Signup() {
  const [formData, setFormData] = useState<RegisterProps>({
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    bio: "",
  });
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setError("please upload file!");
      return;
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Avatar must be a JPEG, PNG, or WebP image!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Avatar file size must be less than 5MB!");
      return;
    }
    setAvatar(file);
    setError("");
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value ,type} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("bio", formData.bio);
      data.append("password", formData.password);
      data.append("phoneNumber", formData.phoneNumber );
      if (avatar) {
        data.append("avatar", avatar);
      }
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      console.log("result ", result);
      if (response.ok) {
        setIsLoading(false);
        setError("");
        toast.success("user registered successfully!");

        setFormData({
          username: "",
          phoneNumber: "",
          email: "",
          password: "",
          bio: "",
        });
        setAvatar(null);
        router.push("/")
      } else {
        setError(result.error || "failed to register!");
      }
    } catch (error: any) {
      console.error("failed to register!", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className=" relative flex flex-col gap-3  p-6 rounded-[10px] bg-[rgb(45,45,45)] "
      >
        {
            error && <span className="w-full text-center text-red-400 bg-gray-500 py-2 rounded-xl">{error }</span>
        }
        {
            isLoading && <div className="absolute inset-0 left-40 top-60">
                <Loader/>
            </div>
        }
        <div className="w-full">
          <h1 className="text-center font-extrabold text-2xl ">SINGUP</h1>
        </div>

        <div className="flex flex-col justify-center items-start gap-1">
          <label className="font-bold ml-2 " htmlFor="avatar">
            Profile photo
          </label>
          <input
            type="file"
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2 text-base text-black shadow-sm placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
            id="avatar"
            name="avatar"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-1">
          <label className="font-bold ml-2 " htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="dan@gmail.com"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-1">
          <label className="font-bold ml-2 " htmlFor="username">
            Username
          </label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="dan360"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-1">
          <label className="font-bold ml-2 " htmlFor="phoneNumber">
            Phone number
          </label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="number"
            placeholder="976610xxxx"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-1">
          <label className="font-bold ml-2 " htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="enter password"
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-white mb-1"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Tell us about yourself..."
          />
        </div>
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}

export default Signup;
