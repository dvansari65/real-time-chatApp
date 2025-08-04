"use client";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { LogOut } from "lucide-react";
interface profileProps {
  avatar: string;
  username: string;
  email: string;
  phoneNumber?: string;
  logout: () => void;
}

function ProfileIcon({
  avatar,
  username,
  email,
  logout,
}: profileProps) {
  const [modal, setModal] = useState(false);
  return (
    <div className="flex flex-col items-center relative">
      <button className="relative" onClick={() => setModal((prev) => !prev)}>
        <img src={avatar} className="size-11 rounded-[50%]" alt="" />
      </button>
      {modal && (
        <div className="absolute top-full right-0 mt-2 border border-gray-300 p-4 rounded-xl flex flex-col gap-3  w-[300px] max-w-[70vw] sm:w-[300px] md:w-[300px] bg-white shadow-lg z-10 ">
          <span className="text-color">@{username}</span>
          <span className="text-color">{email}</span>
          <Button onClick={logout} className="flex justify-start   items-center gap-2 width-full bg-transparent text-black text-start">
            <span className="bg-transparent text-black border rounded-[2px] border-gray-300 text-start py-1 px-2">
              Logout
            </span>
            <LogOut className="text-gray-300" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProfileIcon;
