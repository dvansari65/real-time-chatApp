"use client";
import { MessageCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/contextApi";
import { UserListSkeleton } from "../Skeleton";
import { Button } from "../Button";
import SelectUserForNewGroup from "@/components/NewGroupCreation/SelectUserForNewGroup";
import NewGroupModal from "@/components/NewGroupCreation/GiveNameToTheGroup";
import SearchBar from "@/components/SearchBar";
import { useGetAllChats } from "@/lib/api/useGetAllChats";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {  User } from "@/types/user";
import ChatItem from "../ChatItem";
import { useCreateChatForGroup } from "@/hooks/useCreateChatForGroup";
import { toast } from "sonner";
import { setLoading } from "@/features/Redux/loadingSlice";
import { setGroupId } from "@/features/Redux/groupDataSlice";
import { useQueryClient } from "@tanstack/react-query";
import { createdChatReponse, userFromChat } from "@/types/chat";
import { useCreateChat } from "@/hooks/useCreateChat";


export default function InnerSidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectUserModal, setSelectUserModal] = useState<boolean>(false);
  const [giveNameToNewGroupModal, setGiveNameToNewGroupModal] = useState(false);
  const { data } = useAuth();
  const user = data?.user;
  const queryClient = useQueryClient();
  const { data: allChatsData, isLoading: allChatsDataLoading } = useGetAllChats();
  
  const handleProceedAction = useCallback(() => {
    console.log("Proceed action called!");
    setGiveNameToNewGroupModal(true);
    setSelectUserModal(false);
  }, []);

  const handleBackToPreviousModal = () => {
    setSelectUserModal(true);
    setGiveNameToNewGroupModal(false);
  };
  const {
    mutate: createChatBetweenOneToOneMutation,
    error: OneToOneChatError,
  } = useCreateChat();

  const { mutate, isPending, error: groupChatError } = useCreateChatForGroup();

  const createChatforOneToOneUser = useCallback((userId: number) => {
    console.log("user id",userId)
    dispatch(setLoading(isPending));
    createChatBetweenOneToOneMutation(userId, {
      onSuccess: (data: createdChatReponse) => {
        console.log("data from api", data);
        queryClient.invalidateQueries({queryKey:["user"]})
        if (data?.chat?.id) {
          toast.success("chat created successfully!");
          dispatch(setLoading(isPending));
          router.push(`/chat/${data?.chat?.id}?userId=${userId}`);
        } else {
          dispatch(setLoading(false));
          toast.error("please provide chat id!");
          return;
        }
      },
      onError: (error) => {
        toast.error(error.message);
        return;
      },
    });
  }, [queryClient,user]);

  const createChatForGroup = (
    isGroup: boolean,
    name: string | undefined,
    members: userFromChat[] | undefined,
    description?: string,
    groupId?:number
  ) => {
    dispatch(setLoading(true));
    const payload = {
      isGroup,
      name,
      members,
      description,
      groupId
    };
    if (!isGroup || !name || members?.length == 0) {
      toast.error("Please , provide all the fields!");
      return;
    }
    mutate(payload, {
      onSuccess: (data) => {
        if(!data?.chat?.isGroup){
          return toast.error("select group to create chat!")
        }
        console.log("data",data)
        console.log("chat created!",data)
        queryClient.invalidateQueries({ queryKey: ["getAllChats"] });
        dispatch(setLoading(false));
        if (data?.chat?.id) {
          toast.success("chat created successfully!");
          dispatch(setGroupId(data?.chat?.groupId));
          router.push(`/GroupChat/${data?.chat?.id}?groupId=${data?.chat?.groupId}`);
        }
      },
      onError:(error)=>{
        console.log(error.message)
        toast.error(error?.message)
      }
    },
  
  );
  };
  const filteredUser: Partial<User>[] =useMemo(()=>{
    return  allChatsData?.chats?.flatMap(
      (chat) =>
        chat.members
          ?.map((member) => member?.user)
          .filter((u): u is Partial<User> => !!u) || []
    ) || [];
  },[allChatsData])
  
  if(OneToOneChatError) return toast.error(OneToOneChatError.message)
  // console.log("filtered user", filteredUser);
  if(groupChatError) return toast.error(groupChatError.message)

  return (
    <div className="w-[320px] bg-gray-900/95 backdrop-blur-xl border-r border-white/10 flex flex-col h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>
      {/* Header */}
      {/* Search */}
      <SearchBar />
      {/* Quick Actions */}
      <div className="relative z-10 p-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2 text-white cursor-pointer hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 backdrop-blur-sm group">
            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <Button className="text-sm font-medium bg-transparent border-none p-0 text-white hover:bg-transparent">
              New Chat
            </Button>
          </div>
          <Button
            onClick={() => setSelectUserModal(true)}
            className="text-sm font-medium text-white cursor-pointer  px-4 py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-sm group bg-transparent hover:bg-white/10"
          >
            <span className="group-hover:scale-105 transition-transform duration-300">
              New Group
            </span>
          </Button>
        </div>
      </div>

      {/* Navigation Links */}
      {selectUserModal && (
        <SelectUserForNewGroup
          currentUserId={data?.user?.id}
          proceedAction={handleProceedAction}
          className={`relative`}
          isOpen={selectUserModal}
          onClose={() => setSelectUserModal(false)}
          users={filteredUser}
        />
      )}

      {giveNameToNewGroupModal && (
        <NewGroupModal
          className="relative"
          isOpen={giveNameToNewGroupModal}
          backToPreviousModal={handleBackToPreviousModal}
        />
      )}
      {allChatsDataLoading && (
        <div className="p-4">
          <UserListSkeleton />
        </div>
      )}

      { !giveNameToNewGroupModal &&
        !selectUserModal &&
         allChatsData?.chats?.length === 0 &&
        !allChatsDataLoading ? (
        <div className="w-full text-gray-300 text-center mt-20 text-3xl  ">
          No Chats Yet!
        </div>
      ) : !giveNameToNewGroupModal && !selectUserModal ? (
        <div className="px-2">
          {allChatsData?.chats?.map((chat) => (
            <div
              key={`${chat.id}-${user?.id}`}
              className="w-full flex flex-col mb-2  mt-2 group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer"
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
                    chat?.isGroup || true,
                    chat?.name,
                    chat?.members,
                    chat?.description,
                    chat?.groupId
                  )}
                updatedAt={chat?.updatedAt}
                createChatforOneToOneUser={createChatforOneToOneUser}
                groupId={chat?.groupId}
              />
            </div>
          ))}
        </div>
      ) : null}
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
    </div>
  );
}
