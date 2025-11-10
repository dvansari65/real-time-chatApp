"use client";

import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/contextApi";
import { UserListSkeleton } from "../Skeleton";
import SelectUserForNewGroup from "@/components/NewGroupCreation/SelectUserForNewGroup";
import NewGroupModal from "@/components/NewGroupCreation/GiveNameToTheGroup";
import SearchBar from "@/components/SearchBar";
import { useGetAllChats } from "@/lib/api/useGetAllChats";
import { useSelector } from "react-redux";
import { User } from "@/types/user";
import ChatItem from "../ChatItem";
import { toast } from "sonner";
import { RootState } from "@/lib/store";
import QuickActions from "../QuickActions";
import { useChatOperations } from "@/hooks/useChatOperation";
import { useCreateGroup } from "@/hooks/useCreateGroup";
import AnimatedBG from "../AnimatedBG";
import { Label } from "../Label";
import BottomGradient from "./BottomGradient";

export default function InnerSidebar() {
  const [selectUserModal, setSelectUserModal] = useState<boolean>(false);
  const [groupName, setGroupName] = useState("");
  const [discription, setDiscription] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [giveNameToNewGroupModal, setGiveNameToNewGroupModal] = useState(false);

  const { data } = useAuth();
  const user = data?.user;

  const { data: allChatsData, isLoading: allChatsDataLoading } = useGetAllChats();
  const { createGroup, isCreatingGroup, createGroupError } = useCreateGroup();
  const { createChatforOneToOneUser, createChatForGroup } = useChatOperations();

  const { GroupMembers } = useSelector((state: RootState) => state.NewGroup);

  const handleProceedAction = useCallback(() => {
    console.log("Proceed action called!");
    setGiveNameToNewGroupModal(true);
    setSelectUserModal(false);
  }, []);

  const handleCreateGroup = async () => {
    await createGroup({ avatar, groupName, discription });
  };

  const handleBackToPreviousModal = () => {
    setSelectUserModal(true);
    setGiveNameToNewGroupModal(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
  };

  const filteredUser: Partial<User>[] = useMemo(() => {
    return (
      allChatsData?.chats?.flatMap(
        (chat) =>
          chat.members
            ?.map((member) => member?.user)
            .filter((u): u is Partial<User> => !!u) || []
      ) || []
    );
  }, [allChatsData]);

  const shouldShowChats =
    !giveNameToNewGroupModal &&
    !selectUserModal &&
    !allChatsDataLoading &&
    allChatsData?.chats?.length! > 0;

  const shouldShowEmptyLabel =
    !giveNameToNewGroupModal &&
    !selectUserModal &&
    !allChatsDataLoading &&
    (!allChatsData?.chats || allChatsData?.chats?.length === 0);

  if (createGroupError) {
    toast.error(createGroupError.message);
    return;
  }

  return (
    <div className="w-[320px] bg-gray-900/95 backdrop-blur-xl border-r border-white/10 flex flex-col h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>

      <AnimatedBG />
      <SearchBar />
      <QuickActions setSelectUserModal={setSelectUserModal} />

      {selectUserModal && (
        <SelectUserForNewGroup
          currentUserId={data?.user?.id}
          proceedAction={handleProceedAction}
          className="relative"
          isOpen={selectUserModal}
          onClose={() => setSelectUserModal(false)}
          users={filteredUser}
        />
      )}

      {giveNameToNewGroupModal && (
        <NewGroupModal
          className="relative"
          handleAvatarChange={handleAvatarChange}
          handleCreateGroup={handleCreateGroup}
          isOpen={giveNameToNewGroupModal}
          backToPreviousModal={handleBackToPreviousModal}
          GroupMembers={GroupMembers}
          isPending={isCreatingGroup}
          groupName={groupName}
          setGroupName={setGroupName}
          discription={discription}
          setDiscription={setDiscription}
        />
      )}

      {allChatsDataLoading && <UserListSkeleton />}

      {!user && (
        <div className="flex justify-center h-[50vh] items-center">
          Your are not Login!
        </div>
      )}

      {shouldShowEmptyLabel && <Label text="No Chats Found!" />}

      {shouldShowChats && (
        <div>
          {allChatsData?.chats?.map((chat) => (
            <div
              key={`${chat.id}-${user?.id}`}
              className="w-full flex flex-col mb-2 mt-2 group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <ChatItem
                currentUserId={Number(user?.id)}
                name={chat?.name}
                members={chat?.members}
                messages={chat?.messages || []}
                description={chat?.description}
                isGroup={chat?.isGroup}
                createChatForGroup={() =>
                  createChatForGroup(
                    chat?.isGroup ?? true,
                    chat?.name,
                    chat?.members,
                    chat?.description,
                    chat?.groupId
                  )
                }
                updatedAt={chat?.updatedAt}
                createChatforOneToOneUser={createChatforOneToOneUser}
                groupId={chat?.groupId}
              />
            </div>
          ))}
        </div>
      )}

      {/* Bottom Gradient Fade */}
      <BottomGradient />
    </div>
  );
}
