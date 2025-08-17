import Users from "../Users";

export const UserListItem = ({ 
  user, 
  onChatCreate, 
  isCreatingChat 
}: { 
  user: any; 
  onChatCreate: (userId: number) => void;
  isCreatingChat: boolean;
}) => (
  <button
    onClick={() => onChatCreate(user.id)}
    disabled={isCreatingChat}
    className="w-[100%] flex items-center  p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label={`Start chat with ${user.username}`}
  >
    <Users
      avatar={user?.avatar}
      isOnline={user?.isOnline}
      username={user?.username}
      id={user?.id}
    />
  </button>
);