import { useSearchUsers } from "@/lib/api/useSearchChats";
import { Search, X, User, Users } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { partialUser } from "@/types/user";
import { useCreateChat } from "@/hooks/useCreateChat";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setLoading } from "@/features/Redux/loadingSlice";
import { useRouter } from "next/navigation";
import { useCreateChatForGroup } from "@/hooks/useCreateChatForGroup";
import { groupChatInput } from "@/types/CreateGroup";
import { useQueryClient } from "@tanstack/react-query";
import { setGroupId } from "@/features/Redux/groupDataSlice";
import { userFromChat } from "@/types/chat";
import ResultModaUserCard from "./ui/ResultModaUserCard";
import { useAuth } from "@/contextApi";

interface GroupResult {
  isGroup?:boolean,
  id: string;
  name: string;
  description?: string;
  GroupMembers?: userFromChat[];
  admins: partialUser[];
  avatar: string;
}

function SearchBar() {
  const [query, setQuery] = useState("");
  const [resultModal, setSearchModal] = useState(false);
  const [debounceQuery, setDebounceQuery] = useState(query);
  const queryClient = useQueryClient()
  const dispatch = useDispatch();
  const router = useRouter();
  const {data} = useAuth()
  useEffect(() => {
    const timeOut = setTimeout(() => setDebounceQuery(query), 300);
    return () => clearTimeout(timeOut);
  }, [query]);

  const {
    data: searchedUserData,
    isLoading,
    isError,
    error,
  } = useSearchUsers(debounceQuery);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
    setSearchModal(value.length > 0);
  };

  const handleClose = () => {
    setSearchModal(false);
    setQuery("");
  };

  const { mutate, isPending, error: createChatError } = useCreateChat();
  const {
    mutate: mutateCreateGroupChat,
    error: createGroupChatError,
  } = useCreateChatForGroup();

  const handleChatCreate = (userId: number) => {
    dispatch(setLoading(true));
    console.log("userId",userId)
    mutate(userId, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey:["getAllChats"]})
        queryClient.invalidateQueries({queryKey:["getGroups"]})
        setSearchModal(false);
        if (data?.chat?.id) {
          router.push(`/chat/${data.chat?.id}?userId=${userId}`);
        } else {
          router.push("/");
          toast.error(`chat id not found! ${data?.chat.id}`);
        }
      },
      onError: (error) => {
        console.log("Error", error.message);
      },
    });
  };
  const handlechatCreateForGroup = useCallback(async({
    isGroup,
    name,
    members,
    description,
    groupId
  }: groupChatInput) => {
    dispatch(setLoading(true))
    console.log("payload", isGroup,
      name,
      members,
      description,)
    if(!isGroup || !name || members?.length==0 ){
      toast.error("Please , provide all the fields!");
      return;
    }
    if(!groupId){
      toast.error("Please provide group ID!");
      return;
    }
    const payload = {
      isGroup,
      name,
      members,
      description,
      groupId
    };
    mutateCreateGroupChat(payload,{
      onSuccess:(data)=>{
        queryClient.invalidateQueries({queryKey:["getAllChats"]})
        setSearchModal(false)
        console.log("data of group chat",data?.id)
        if(data?.chat?.id){
          router.push(`/GroupChat/${data.chat.id}&groupId=${groupId}`)
          dispatch(setLoading(false))
        }
      },
      onError:(error)=>{
        router.push("/");
        dispatch(setLoading(false))
        toast.error(error.message)
      }
    });
  },[query,queryClient,debounceQuery])
  
  if(createGroupChatError)return toast.error(createChatError?.message || "some thing went wrong!")
  
  const hasResults =
    searchedUserData?.success &&
    (searchedUserData?.chat?.length > 0 || searchedUserData?.group?.length > 0);

  const hasUsers =
    searchedUserData?.user?.length > 0 && searchedUserData?.success;

  const hasGroups =
    searchedUserData?.group?.length > 0 && searchedUserData?.success;

  return (
    <>
      <div className="z-10 p-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="relative w-full h-full flex items-center">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
          />
          <Search className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {resultModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-24 ">
          <div className="relative w-full max-w-2xl mx-4 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-medium">Search Results</h3>
              <Button
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                variant="ghost"
              >
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(70vh - 80px)" }}
            >
              {isLoading && (
                <div className="text-gray-400 text-center py-8 px-4">
                  Searching...
                </div>
              )}

              {isError && (
                <div className="text-red-400 text-center py-8 px-4">
                  Error: {error?.message || "Something went wrong"}
                </div>
              )}
              {createChatError && (
                <div className="text-red-400 text-center py-8 px-4">
                  Error: {createChatError?.message || "Something went wrong"}
                </div>
              )}

              {!isLoading && !isError && !hasResults && !hasUsers && (
                <div className="text-gray-400 text-center py-8 px-4">
                  No results found for "{query}"
                </div>
              )}

              {!isLoading && !isError && (
                <div className="p-4 space-y-6">
                  {hasUsers && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-blue-400" />
                        <h4 className="text-white font-medium text-sm">
                          Users ({searchedUserData?.user?.length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {searchedUserData?.user?.map((user: partialUser) => (
                          <div key={user.id}>
                            <ResultModaUserCard
                              username={user.username}
                              email={user.email}
                              id={user.id}
                              currenUserId={data?.user?.id}
                              handleChatCreate={handleChatCreate}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {hasGroups && (
                    <div className="w-full">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-green-400" />
                        <h4 className="text-white font-medium text-sm">
                          Groups ({searchedUserData.group.length})
                        </h4>
                      </div>
                      <div className="space-y-2 w-full">
                        {searchedUserData?.group?.map((group: GroupResult) => (
                          <Button
                            onClick={()=>{
                              if(!group?.id) return toast.error("group id is missing!")
                              dispatch(setGroupId(Number(group?.id)))
                              handlechatCreateForGroup(
                                {
                                  isGroup:group?.isGroup || true ,
                                  name:group?.name, 
                                  members:group?.GroupMembers || [],
                                  description:group?.description,
                                  groupId:group.id
                                 }
                              );
                             
                            }}
                            key={group?.id}
                            className="p-3 w-full flex justify-start bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors border border-white/5 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="text-white font-medium">
                                  {group?.name}
                                </div>
                                {group.description && (
                                  <div className="text-gray-400 text-sm">
                                    {group?.description}
                                  </div>
                                )}
                                {group.GroupMembers && (
                                  <div className="text-gray-500 text-xs">
                                    {group?.GroupMembers?.length} members
                                  </div>
                                )}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchBar;
