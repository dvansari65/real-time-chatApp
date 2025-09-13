import MessageSkeleton from "@/components/ui/Skeleton/MessageSkeleton";
import { formatTime } from "@/helper/formatTime";
import { Message } from "@/types/message";
import { partialUser } from "@/types/user";

interface GroupMessageContainerProps {
  message: Message | null,
  currentUserId: number,
  groupMembers: partialUser[],
  status: "SENT" | "DELIVERED" | "READ",
  groupChatLoading:boolean
}

const GroupMessageContainer = ({
  message,
  currentUserId,
  groupMembers,
  status,
  groupChatLoading
}: GroupMessageContainerProps) => {
  const isOwnMessage = message?.senderId === currentUserId;
  const sender = groupMembers?.find(member => member?.id === message?.senderId);

  if(groupChatLoading) return <MessageSkeleton/>

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3 ml-2`}>
      <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end max-w-xs lg:max-w-md`}>
        {!isOwnMessage && (
          <img
            src={sender?.avatar || '/default-avatar.png'}
            alt={sender?.username}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0 mb-1"
          />
        )}
        <div className={`flex flex-col ${isOwnMessage ? 'items-end mr-2' : 'items-start ml-2'}`}>
          {!isOwnMessage && (
            <p className="text-xs text-gray-400 mb-1 px-3">
              {sender?.username || 'Unknown User'}
            </p>
          )}
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwnMessage
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-md transform hover:scale-[1.02]'
                : 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 rounded-bl-md border border-gray-700 transform hover:scale-[1.02]'
            }`}
          >
            <p className="text-sm">{message?.content}</p>
            <div className={`flex items-center justify-end mt-1 space-x-1 ${
              isOwnMessage ? 'text-green-100' : 'text-gray-400'
            }`}>
              <span className="text-xs">
                {formatTime(message?.createdAt)}
              </span>
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

export default GroupMessageContainer;