"use client"
import React, { useEffect, useState } from "react";
import {
  X,
  Users,
  Shield,
  Calendar,
  Image as ImageIcon,
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
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 flex justify-center   ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900/50 to-purple-900/30 pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200 hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="relative z-10 max-h-[80vh] overflow-y-auto">
          {/* Header Section */}
          <div className="p-8 text-center border-b border-gray-700/50">
            {/* Group Avatar */}
            <div className="flex justify-center mb-4">
              {group?.profileImage ? (
                <img
                  src={group.profileImage}
                  alt={group.name}
                  className="w-24 h-24 rounded-full border-4 border-purple-500/50 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center border-4 border-purple-500/50 shadow-lg">
                  <Users className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            {/* Group Name */}
            <h2 className="text-2xl font-bold text-white mb-2">
              {group?.name}
            </h2>

            {/* Group Description */}
            {group?.discription && (
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                {group.discription}
              </p>
            )}

            {/* Stats */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="bg-gray-700/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600/30">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-semibold">
                    {members.length}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Members</p>
              </div>

              <div className="bg-gray-700/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">
                    {activeMembers.length}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Online</p>
              </div>

              <div className="bg-gray-700/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600/30">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-semibold">
                    {admins.length}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Admins</p>
              </div>
            </div>
          </div>

          {/* Members Section */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Members
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {members.map((member) => {
                const isGroupAdmin = admins.some(
                  (admin) => admin.id === member.id
                );
                const isCreator = member.id === group?.userId;

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-700/30 backdrop-blur-sm rounded-lg border border-gray-600/30 hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-semibold text-white">
                          {member.username?.charAt(0).toUpperCase()}
                        </div>
                        {member.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>

                      {/* Member Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">
                            {member.username}
                          </p>
                          {isCreator && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                              Creator
                            </span>
                          )}
                          {isGroupAdmin && !isCreator && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 rounded-full border border-purple-500/30">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          {member.email || "No email"}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        member.isOnline
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-gray-600/30 text-gray-400 border border-gray-600/30"
                      }`}
                    >
                      {member.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Created By Section */}
          <div className="px-6 pb-6">
            <div className="p-4 bg-gray-700/20 backdrop-blur-sm rounded-lg border border-gray-600/30">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span>Group Information</span>
              </div>
              <p className="text-white text-sm">
                Created by{" "}
                <span className="font-semibold text-blue-400">
                  {group?.createdBy || "Unknown"}
                </span>
              </p>
              {group?.id && (
                <p className="text-xs text-gray-500 mt-1">
                  Group ID: {group.id}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(31, 41, 55, 0.3);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(107, 114, 128, 0.5);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(107, 114, 128, 0.7);
          }
        `}</style>
      </div>
    </div>
  );
};

export default GroupInfoModal