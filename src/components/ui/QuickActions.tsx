import { MessageCircle } from 'lucide-react'
import React from 'react'
import { Button } from './Button'

interface QuickActionsProps {
    setSelectUserModal:(value:boolean)=>void
}

function QuickActions({setSelectUserModal}:QuickActionsProps) {
  return (
    <div className="relative z-10 p-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2 text-white cursor-pointer hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 backdrop-blur-sm group">
            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <Button className="text-sm font-medium bg-transparent border-none p-0 text-white hover:bg-transparent">
              New Chat
            </Button>
          </div>
          <Button
            onClick={() => setSelectUserModal(true)}
            className="text-sm font-medium text-white cursor-pointer  px-4 py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-sm group bg-transparent hover:bg-white/10"
          >
            <span className="group-hover:scale-105 transition-transform duration-300">
              New Group
            </span>
          </Button>
        </div>
      </div>
  )
}

export default QuickActions