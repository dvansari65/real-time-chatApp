import { Button } from "@/components/ui/Button";
import { groupType } from "@/types/CreateGroup";
import { Group } from "@/types/group";
import { ArrowLeft, Settings, Users } from "lucide-react";

interface GroupChatHeaderProps {
  group: Group;
  onShowMembers?: () => void;
  onShowSettings?: () => void;
  isLoading: boolean;
  leaveChat:()=>void
}

const GroupChatHeader = ({
  group,
  onShowMembers,
  onShowSettings,
  isLoading,
  leaveChat
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
                <div className="w-10 h-10 rounded-full bg-gray-600 animate-pulse"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-600 rounded-full animate-pulse">
                  <span className="text-xs text-white font-bold flex items-center justify-center h-full"></span>
                </div>
              </div>
            ) : (
              <div>
               <div className="flex items-center gap-2 ">
                <Button className="mr-2 " onClick={leaveChat}>
                  <ArrowLeft size={25}/>
                </Button>
                <Users size={35} />
               </div>
                <div
                  className={`w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center ${
                    group?.profileImage ? "hidden" : "flex"
                  }`}
                >
                  <span className="text-white font-semibold text-sm">
                    {group?.name?.charAt(0)?.toUpperCase() || "G"}
                  </span>
                </div>
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
              <div className="h-5 w-32 bg-gray-600 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-24 bg-gray-600 rounded animate-pulse"></div>
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
