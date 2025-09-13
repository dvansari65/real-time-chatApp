
import {  userFromChat } from "@/types/chat";
import { Message } from "@/types/message";
import { UserIcon } from "lucide-react";
import React, { useMemo } from "react";
import { toast } from "sonner";
import GroupChatItem from "../chat/GroupChat/GroupChatItem";
import { Button } from "./Button";

export interface ChatItemProps {
  id?: number;
  name?: string | undefined;
  isGroup?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  messages?: Message[];
  members?: userFromChat[];
  currentUserId?:number;
  groupId?:number | undefined;
  createChatForGroup:(isGroup: boolean, name: string, members: userFromChat[], description?: string)=>void
  createChatforOneToOneUser:(targetUserId:number)=>void
}

function ChatItem({
  name,
  members,
  messages,
  description,
  currentUserId,
  isGroup,
  createChatForGroup,
  updatedAt,
  createChatforOneToOneUser,
  groupId,
}:ChatItemProps ) {

  const targetUser = useMemo(()=>{
    if(!members || !currentUserId){
      return null;
    }
    const filteredUser = members
    .filter(member=>
      member?.user?.id && typeof member?.user?.id === "number" && 
          member?.user?.id !== currentUserId
    )
    .map(member=>member?.user)

    return filteredUser.length > 0 ? filteredUser[0] : null
  },[members,currentUserId])
  
  const handleOneToOneChat = ()=>{
    if(!currentUserId){
      toast.error("please first login!")
      return;
    }
    if(!targetUser?.id){
      toast.error("please provide target user id!")
      return;
    }
    if(targetUser === currentUserId){
      toast.error("You can not create chat with yourself!")
      return;
    }
    createChatforOneToOneUser(targetUser?.id)
  }
  const handleGroupChat = ()=>{
    if(!isGroup){
      toast.error("this chat is not group chat!")
      return;
    }
    if(!currentUserId){
      toast.error("please provide current user id!")
      return;
    }
    if(members?.length === 0 || !members){
      toast.error("Atleast 2 members required to make chat in Group !")
      return;
    }
    if (!name || name.trim().length === 0) {
      toast.error("Group name is required.");
      return;
    }
    createChatForGroup(true,name,members,description)
  }
  if (isGroup) {
    return (
      <GroupChatItem
        id={groupId}
        isGroup={true}
        createChatForGroup={handleGroupChat}
        groupName={String(name)}
        messages={messages}
        updatedAt={String(updatedAt) || String(new Date())}
        members={members}
      />
    );
  }
  return (
    <div className="flex items-center w-full">
    {targetUser?.id !== currentUserId ? (
    <div className="flex items-center space-x-3 w-full">
     <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
       {targetUser?.avatar ? (
         <img
           src={targetUser?.avatar}
           className="w-full h-full rounded-full object-cover"
           alt={`${targetUser?.username}'s avatar`}
         />
       ) : (
         <UserIcon size={18} />
       )}
     </div>
     <Button onClick={handleOneToOneChat} className="flex-1 min-w-0 text-left ">
       <div className="w-full">
         <div className="flex justify-between items-center mb-1">
           <p className="text-sm font-medium text-purple-400 truncate">
             {targetUser?.username}
           </p>
           <p className="text-[11px] text-gray-400 flex-shrink-0">
             {targetUser?.isOnline ? "Online" : "Offline"}
           </p>
         </div>
         <p className="text-sm text-gray-500 truncate">
           Last message preview...
         </p>
       </div>
     </Button>
   </div>
 ) : null}
</div>
  );
}

export default ChatItem;
