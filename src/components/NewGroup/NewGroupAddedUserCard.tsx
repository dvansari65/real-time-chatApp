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
    <div className="px-4 py-3 bg-white border-b border-gray-200">
      <div className="text-sm text-gray-600 mb-2">
        {addedUsers.length} member{addedUsers.length > 1 ? 's' : ''} selected
      </div>
      
      <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
        {addedUsers.map((user) => (
          <div
            key={user?.id}
            className="flex-shrink-0 relative animate-in slide-in-from-right-2 duration-300"
          >
            <div className="flex flex-col items-center min-w-[70px]">
              {/* User Avatar with Remove Button */}
              <div className="relative">
                <img 
                  className="w-14 h-14 rounded-full object-cover border-2 border-green-500 mt-2" 
                  src={user?.avatar || '/default-avatar.png'} 
                  alt={user?.username}
                />
                {onRemoveUser && (
                  <button
                    onClick={() => onRemoveUser(Number(user.id))}
                    className="absolute -top-[-3px] -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={12} className="text-white" />
                  </button>
                )}
              </div>
              
              {/* Username */}
              <span className="text-xs text-gray-700 mt-2 text-center max-w-[70px] truncate">
                {user?.username}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewGroupAddedUsersCard