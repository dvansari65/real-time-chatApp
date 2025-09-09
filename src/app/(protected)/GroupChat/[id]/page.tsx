import GroupChatHeader from '@/components/chat/GroupChat/GroupChatHeader'
import GroupMessageContainer from '@/components/chat/GroupChat/GroupMessageContainer'
import { RootState } from '@/lib/store'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import RedirectPage from '../../Redirecting/page'
import { useGetSingleGroup } from '@/lib/api/getSingleGroup'
import { useAuth } from '@/contextApi'
import { Message } from '@/types/message'

function page() {
    const {data:currentUserData} = useAuth()
    const {id:groupId} = useSelector((state:RootState)=>state.groupData)
    const {data,isLoading,error} = useGetSingleGroup(Number(groupId))
    const [message,setMessage] = useState<Message | null>(null)
  return (
    <div>
        <GroupChatHeader
         isLoading={isLoading}
          group={data?.group!}
        />
        <GroupMessageContainer
          groupMembers={data?.group?.GroupMembers || []}
          currentUserId={Number(currentUserData?.user?.id)}
          status="SENT"
          message={message }
        />
    </div>
  )
}

export default page