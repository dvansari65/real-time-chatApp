import { useAuth } from "@/contextApi";
import { chatMember, userFromChat } from "@/types/chat";
import { Message, messageStatus } from "@/types/message";
import { partialUser } from "@/types/user";
import { UserIcon, Users } from "lucide-react";
import React from "react";
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
  createChatForGroup:(isGroup: boolean, name: string, members: partialUser[], description?: string)=>void
  createChatforOneToOneUser:(userId:number)=>void
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
  
}:ChatItemProps ) {

  const filteredUser = members?.find(
    (member) => member.user?.id !== currentUserId
  );

  const user = filteredUser?.user;
  if (isGroup) {
    return (
      <GroupChatItem
        createChatForGroup={()=>createChatForGroup(isGroup,name="",members=[],description="")}
        groupName={String(name)}
        messages={messages}
        updatedAt={String(updatedAt) || String(new Date())}
        members={members}
      />
    );
  }
  return (
    <div className="flex items-center w-full">
 {filteredUser?.user?.id !== currentUserId ? (
   <div className="flex items-center space-x-3 w-full">
     <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
       {user?.avatar ? (
         <img
           src={user?.avatar}
           className="w-full h-full rounded-full object-cover"
           alt={`${user?.username}'s avatar`}
         />
       ) : (
         <UserIcon size={18} />
       )}
     </div>
     <Button onClick={()=>createChatforOneToOneUser(Number(filteredUser?.user?.id))} className="flex-1 min-w-0 text-left ">
       <div className="w-full">
         <div className="flex justify-between items-center mb-1">
           <p className="text-sm font-medium text-purple-400 truncate">
             {user?.username}
           </p>
           <p className="text-[11px] text-gray-400 flex-shrink-0">
             {user?.isOnline ? "Online" : "Offline"}
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
