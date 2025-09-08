import GroupChatHeader from '@/components/chat/GroupChat/GroupChatHeader'
import GroupMessageContainer from '@/components/chat/GroupChat/GroupMessageContainer'
import { RootState } from '@/lib/store'
import React from 'react'
import { useSelector } from 'react-redux'
import RedirectPage from '../../Redirecting/page'

function page() {
    const {isLoading} = useSelector((state:RootState)=>state.Loading)
    if(isLoading){
        return <RedirectPage/>
    }
  return (
    <div>
        <GroupChatHeader/>
        <GroupMessageContainer/>
    </div>
  )
}

export default page