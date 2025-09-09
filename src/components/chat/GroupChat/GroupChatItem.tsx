import { Button } from '@/components/ui/Button';
import { Chat, userFromChat } from '@/types/chat';
import { Message, messageStatus } from '@/types/message';
import { Users } from 'lucide-react'
import React from 'react'


interface GroupChatItemProps {
  groupName:string,
  id?: number;
  name?: string;
  isGroup?:boolean,
  createdAt?: Date;
  updatedAt?: string;
  description?: string;
  messages?: Message[];
  members?: userFromChat[];
  createChatForGroup:()=>void
}

function GroupChatItem({groupName,updatedAt,createChatForGroup,messages,members}:GroupChatItemProps) {
  const formateDate= (dateString?:string)=>{
    if(!dateString) return new Date();
    return new Date(dateString).toLocaleDateString()
  }
  const latestMessages = messages?.map(message=>({
    sender:message?.sender,
    message:message?.content[0]
  }))
  return (
    <div className="flex items-center gap-4 w-full ">
        <div>
          <Users className='text-gray-500 ml-2' size={34} />
        </div>
        <Button onClick={createChatForGroup} className="flex flex-col  justify-center w-full">
          <div className="w-full flex justify-between ">
            <div className="text-sm text-purple-400">{groupName}</div>
            <div className='text-[10px] text-gray-400'>{formateDate(updatedAt) as string}</div>
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="text-[15px] text-gray-500 flex items-center ">
              <span>{latestMessages?.[0]?.sender || "Last message preview..."}</span>
              <span>{latestMessages?.[0]?.message}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="text-gray-500" size={12} />
              <p className="text-gray-500 text-[14px]">
                {members?.length}
              </p>
            </div>
          </div>
        </Button>
      </div>
  )
}

export default GroupChatItem