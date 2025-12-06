"use client"
import React, { useEffect, useState } from "react";
import {
  X,
  Users,
  Shield,
  Calendar,
} from "lucide-react";
import { Group } from "@/types/group";

interface GroupInfoModalProps {
  group:Group | undefined;
  isOpen:boolean;
  onClose:()=>void;
  currentUserId:number | undefined;
}

const GroupInfoModal = ({ group, isOpen, onClose, currentUserId }:GroupInfoModalProps) => {
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const admins = group?.admins || [];
  const members = group?.GroupMembers || [];
  const isAdmin = admins.some((admin) => admin.id === currentUserId);
  const activeMembers = members.filter((member) => member.isOnline);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div
        className={`relative w-full max-w-md bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="max-h-[85vh] overflow-y-auto">
          <div className="p-5 text-center border-b border-gray-700">
            <div className="flex justify-center mb-3">
              {group?.profileImage ? (
                <img
                  src={group.profileImage}
                  alt={group.name}
                  className="w-16 h-16 rounded-full border-2 border-purple-500"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center border-2 border-purple-500">
                  <Users className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-white mb-1">
              {group?.name}
            </h2>

            {group?.discription && (
              <p className="text-gray-400 text-xs">
                {group.discription}
              </p>
            )}

            <div className="flex justify-center gap-4 mt-4">
              <div className="bg-gray-700/40 rounded-lg px-3 py-1.5">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-white font-semibold text-sm">
                    {members.length}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Members</p>
              </div>

              <div className="bg-gray-700/40 rounded-lg px-3 py-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-white font-semibold text-sm">
                    {activeMembers.length}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Online</p>
              </div>

              <div className="bg-gray-700/40 rounded-lg px-3 py-1.5">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-white font-semibold text-sm">
                    {admins.length}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Admins</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Members
            </h3>

            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
              {members.map((member) => {
                const isGroupAdmin = admins.some(
                  (admin) => admin.id === member.id
                );
                const isCreator = member.id === group?.userId;

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2.5 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                          {member.username?.charAt(0).toUpperCase()}
                        </div>
                        {member.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-white text-sm font-medium">
                            {member.username}
                          </p>
                          {isCreator && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-yellow-500/20 text-yellow-400 rounded">
                              Creator
                            </span>
                          )}
                          {isGroupAdmin && !isCreator && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-purple-500/20 text-purple-400 rounded">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400">
                          {member.email || "No email"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded ${
                        member.isOnline
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-600/30 text-gray-400"
                      }`}
                    >
                      {member.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="p-3 bg-gray-700/20 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Group Information</span>
              </div>
              <p className="text-white text-xs">
                Created by{" "}
                <span className="font-semibold text-blue-400">
                  {group?.createdBy || "Unknown"}
                </span>
              </p>
              {group?.id && (
                <p className="text-[10px] text-gray-500 mt-0.5">
                  ID: {group.id}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoModal;