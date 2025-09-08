import { useSearchUsers } from "@/lib/api/useSearchChats";
import { Search, X, User, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { partialUser } from "@/types/user";
import { useCreateChat } from "@/hooks/useCreateChat";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setLoading } from "@/features/Redux/loadingSlice";
import { useRouter } from "next/navigation";
import { setQueriedUserData } from "@/features/Redux/searchedUserSlice";
import { storeMessages } from "@/features/Redux/allChatsSlice";
import { useCreateChatForGroup } from "@/hooks/useCreateChatForGroup";
import { groupChatInput } from "@/types/CreateGroup";

interface GroupResult {
  isGroup?:boolean,
  id: string;
  name: string;
  description?: string;
  GroupMembers?: partialUser[];
  admins: partialUser[];
  avatar: string;
}

function SearchBar() {
  const [query, setQuery] = useState("");
  const [resultModal, setSearchModal] = useState(false);
  const [debounceQuery, setDebounceQuery] = useState(query);
  const dispatch = useDispatch();
  const router = useRouter();
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
    isPending: isPendingGroupChat,
    error: createGroupChatError,
  } = useCreateChatForGroup();
  const handleChatCreate = (userId: number) => {
    const user =
      searchedUserData.user?.find((i: partialUser) => i?.id === userId) || null;
    console.log("queried user", user);
    dispatch(setQueriedUserData(user));
    dispatch(setLoading(true));
    mutate(userId, {
      onSuccess: (data) => {
        console.log("data", data);
        setSearchModal(false);
        dispatch(storeMessages(data?.chat?.messages));
        dispatch(setLoading(false));
        if (data?.chat?.id) {
          router.push(`/chat/${data.chat?.id}`);
        } else {
          router.push("/");
          toast.error(`chat id not found! ${data?.chat?.id}`);
        }
      },
      onError: (error) => {
        console.log("Error", error.message);
      },
    });
  };
  const handlechatCreateForGroup = async ({
    isGroup,
    name,
    members,
    description,
  }: groupChatInput) => {
    dispatch(setLoading(true))
    console.log("payload", isGroup,
      name,
      members,
      description,)
    if(!isGroup || !name || members.length==0 ){
      toast.error("Please , provide all the fields!");
      return;
    }
    const payload = {
      isGroup,
      name,
      members,
      description,
    };
   
    mutateCreateGroupChat(payload,{
      onSuccess:(data)=>{
        dispatch(setLoading(false))
        setSearchModal(false)
        console.log("data of group chat",data?.id)
        if(data?.chat?.id){
          router.push(`/groupChat/${data?.chat?.id}`)
        }else{
          router.push("/");
          toast.error(`chat id not found! ${data?.chat?.id}`);
        }
      },
      onError:(error)=>{
        dispatch(setLoading(false))
        toast.error(error.message)
        console.log(error.message)
      }
    });
  };

  // Check if we have any results
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
                  {/* Chat Results Section */}
                  {hasUsers && (
                    <div>
                      {/* <span>{data?.user?.[0]?.username}</span> */}
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-blue-400" />
                        <h4 className="text-white font-medium text-sm">
                          Users ({searchedUserData?.user?.length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {searchedUserData?.user?.map((user: partialUser) => (
                          <Button
                            onClick={() => handleChatCreate(Number(user?.id))}
                            key={user?.id}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors border border-white/5 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="text-white font-medium">
                                  {user?.username}
                                </div>
                                {user?.email && (
                                  <div className="text-gray-400 text-sm">
                                    {user?.email}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasGroups && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-green-400" />
                        <h4 className="text-white font-medium text-sm">
                          Groups ({searchedUserData.group.length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {searchedUserData?.group?.map((group: GroupResult) => (
                          <Button
                            onClick={()=>handlechatCreateForGroup(
                              {
                                isGroup:group?.isGroup || true ,
                                name:group?.name, 
                                members:group?.GroupMembers || [],
                                description:group?.description
                               }
                            )}
                            key={group?.id}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors border border-white/5 group"
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
