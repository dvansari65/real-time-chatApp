import { groupType } from "@/types/CreateGroup";
import { Group } from "@/types/group";
import { Settings, Users } from "lucide-react";

interface GroupChatHeaderProps {
  group: Group ;
  onShowMembers?: () => void;
  onShowSettings?: () => void;
  isLoading: boolean;
}

const GroupChatHeader = ({
  group,
  onShowMembers,
  onShowSettings,
  isLoading,
}: GroupChatHeaderProps) => {
  const activeMembers =
    group?.GroupMembers?.filter((member) => member.isOnline) || [];
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Group Avatar */}
          <div className="relative">
            {isLoading ? (
              <div>
                <div className="w-10 h-10 rounded-full object-cover bg-gray-500"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-500 rounded-full ">
                  <span className="text-xs text-white font-bold flex items-center justify-center h-full"></span>
                </div>
              </div>
            ) : (
              <div>
                <img
                  src={group?.profileImage || "/default-group.png"}
                  alt={group?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800">
                  <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                    {activeMembers.length}
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* Group Info */}
          {isLoading ? (
            <div>
              <h3 className="bg-gray-500"></h3>
              <p className="bg-gray-500 w-2 h-2 ">
                <span className=" ml-1"></span>
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-white font-semibold text-lg">
                {group?.name}
              </h3>
              <p className="text-gray-400 text-sm">
                {group?.GroupMembers?.length} members
                {activeMembers.length > 0 && (
                  <span className="text-green-400 ml-1">
                    • {activeMembers.length} online
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onShowMembers}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            title="View Members"
          >
            <Users className="w-5 h-5" />
          </button>
          <button
            onClick={onShowSettings}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            title="Group Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatHeader;
