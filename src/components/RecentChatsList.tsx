import { User } from '@/types/user'
import React from 'react'

interface recentchatUserProps {
    users : User[],
    time:string
}

function RecentChatsList() {
  return (
    <div className="p-2 space-y-2">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-medium">U{i}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 truncate">User {i}</p>
            <p className="text-xs text-gray-500">2:30 PM</p>
          </div>
          <p className="text-sm text-gray-500 truncate">Last message preview...</p>
        </div>
      </div>
    ))}
  </div>
  )
}

export default RecentChatsList