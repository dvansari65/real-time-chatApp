import { Chat } from '@/types/chat';
import { Users } from 'lucide-react'
import React from 'react'

interface GroupChatItemProps {
    groupName:string,
    updatedAt?:Date;
    chatResponse:Chat
}

function GroupChatItem({groupName,updatedAt,chatResponse}:GroupChatItemProps) {
  return (
    <div className="flex items-center gap-4 w-full ">
        <div>
          <Users size={38} />
        </div>
        <div className="flex flex-col  justify-center w-full">
          <div className="w-full flex justify-between ">
            <div className="text-xl text-gray-300">{groupName}</div>
            <div>{updatedAt?.toLocaleDateString()}</div>
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="text-[15px] text-gray-500">Alice:hey there..</div>
            <div className="flex items-center gap-1">
              <Users className="text-gray-500" size={12} />
              <p className="text-gray-500 text-[14px]">
                {chatResponse?.members?.length}
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default GroupChatItem