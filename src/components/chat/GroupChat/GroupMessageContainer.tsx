import { Message } from "@/types/message";
import { partialUser } from "@/types/user";

interface GroupMessageContainerProps {
    message:Message | null,
    currentUserId:number,
    groupMembers:partialUser[],
    status:"SENT" | "DELIVERED" | "READ"
}
const GroupMessageContainer = ({ 
    message, 
    currentUserId, 
    groupMembers,
    status 
  }:GroupMessageContainerProps) => {
    const isOwnMessage = message?.senderId === currentUserId;
    const sender = groupMembers?.find(member => member.id === message?.senderId);
    
    return (
      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs lg:max-w-md`}>
          
          {/* Sender Avatar (only for others' messages) */}
          {!isOwnMessage && (
            <img
              src={sender?.avatar || '/default-avatar.png'}
              alt={sender?.username}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          )}
          
          <div className={`${isOwnMessage ? 'mr-2' : 'ml-2'}`}>
            {/* Sender Name (only for others' messages) */}
            {!isOwnMessage && (
              <p className="text-xs text-gray-400 mb-1 ml-3">
                {sender?.username || 'Unknown User'}
              </p>
            )}
            
            {/* Message Bubble */}
            <div
              className={`px-4 py-2 rounded-2xl ${
                isOwnMessage
                  ? 'bg-green-600 text-white rounded-br-md'
                  : 'bg-gray-700 text-gray-100 rounded-bl-md'
              }`}
            >
              <p className="text-sm">{message?.content}</p>
              
              {/* Message Time and Status */}
              <div className={`flex items-center justify-end mt-1 space-x-1 ${
                isOwnMessage ? 'text-green-100' : 'text-gray-400'
              }`}>
                <span className="text-xs">
                  {message?.createdAt?.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </span>
                
                {/* Status indicator (only for own messages) */}
                {isOwnMessage && (
                  <div className="flex">
                    {status === 'SENT' && (
                      <div className="w-2 h-2 border border-gray-300 rounded-full"></div>
                    )}
                    {status === 'DELIVERED' && (
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    )}
                    {status === 'READ' && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default GroupMessageContainer