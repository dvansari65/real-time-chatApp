"use client"
import { partialUser } from '@/types/user'
import { X } from 'lucide-react'
import React from 'react'

interface NewGroupAddedUserCardProps {
  addedUsers: partialUser[],
  onRemoveUser?: (userId: number) => void; // Optional callback to remove user
}

function NewGroupAddedUsersCard({ addedUsers, onRemoveUser }: NewGroupAddedUserCardProps) {
  if (addedUsers.length === 0) return null;

  return (
    <div className="px-4 py-4 bg-white/5 backdrop-blur-sm border-b border-white/10 relative overflow-hidden">
  {/* Subtle animated background */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse"></div>
  
  <div className="relative z-10">
    {/* Header with count */}
    <div className="flex items-center space-x-2 mb-3">
      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
      <div className="text-sm text-gray-300 font-medium">
        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
          {addedUsers.length}
        </span>
        {' '}member{addedUsers.length > 1 ? 's' : ''} selected
      </div>
    </div>

    {/* Users horizontal scroll */}
    <div className="flex overflow-x-auto space-x-4 pb-3 scrollbar-hide">
      {addedUsers.map((user, index) => (
        <div
          key={user?.id}
          className="flex-shrink-0 relative group animate-in slide-in-from-right-2 duration-500"
          style={{ 
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'both'
          }}
        >
          <div className="flex flex-col items-center min-w-[75px]">
            {/* User Avatar with Remove Button */}
            <div className="relative">
              {/* Animated ring around avatar */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 p-0.5 animate-spin-slow">
                <div className="w-full h-full rounded-full bg-gray-900"></div>
              </div>
              
              {/* Avatar */}
              <img
                className="relative w-14 h-14 rounded-full object-cover border-2 border-transparent bg-gradient-to-r from-blue-400 to-purple-400 p-0.5 group-hover:scale-110 transition-all duration-300 z-10"
                src={user?.avatar || '/default-avatar.png'}
                alt={user?.username}
                style={{
                  clipPath: 'circle(calc(50% - 1px))',
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)'
                }}
              />
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
              
              {/* Remove button */}
              {onRemoveUser && (
                <button
                  onClick={() => onRemoveUser(Number(user.id))}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-gray-900 z-20"
                >
                  <X size={12} className="text-white" />
                  {/* Button glow effect */}
                  <div className="absolute inset-0 rounded-full bg-red-500/30 blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
            </div>

            {/* Username with gradient on hover */}
            <span className="text-xs text-gray-300 mt-3 text-center max-w-[75px] truncate group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 font-medium">
              {user?.username}
            </span>
            
            {/* Subtle bottom indicator */}
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Custom scrollbar styling - add to your CSS */}
  <style jsx>{`
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    
    @keyframes spin-slow {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    .animate-spin-slow {
      animation: spin-slow 3s linear infinite;
    }
    
    @keyframes slide-in-from-right-2 {
      from {
        transform: translateX(8px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .animate-in {
      animation-fill-mode: both;
    }
    
    .slide-in-from-right-2 {
      animation-name: slide-in-from-right-2;
    }
  `}</style>
</div>
  )
}

export default NewGroupAddedUsersCard