"use client";

import React, { useEffect, useState } from "react";
import { X, User, Mail, Phone, Calendar } from "lucide-react";
import { partialUser } from "@/types/user";



interface UserInfoModalProps {
  user?: partialUser;
  isOpen: boolean;
  onClose: () => void;
}

const UserInfoModal = ({ user, isOpen, onClose }: UserInfoModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className={`relative w-full max-w-md bg-gray-800 rounded-xl shadow-2xl border border-gray-700 transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-5 text-center border-b border-gray-700">
          <div className="flex justify-center mb-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-20 h-20 rounded-full border-2 border-purple-500"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center border-2 border-purple-500">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-white mb-1">
            {user?.username}
          </h2>

          <p className="text-sm">
            {user?.isOnline ? (
              <span className="text-green-400">Online</span>
            ) : (
              <span className="text-gray-400">
                Offline{user?.lastSeen && ` • Last seen ${new Date(user.lastSeen).toLocaleString()}`}
              </span>
            )}
          </p>

          {user?.bio && (
            <p className="text-gray-400 text-xs mt-2">{user.bio}</p>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-3">
          <InfoRow icon={<Mail />} label="Email" value={user?.email} />
          <InfoRow icon={<Phone />} label="Phone" value={user?.phoneNumber} />
          <InfoRow
            icon={<Calendar />}
            label="Joined"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toDateString()
                : ""
            }
          />
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
}) => {
  if (!value) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
      <div className="text-purple-400">{icon}</div>
      <div>
        <p className="text-[11px] text-gray-400">{label}</p>
        <p className="text-sm text-white">{value}</p>
      </div>
    </div>
  );
};

export default UserInfoModal;
