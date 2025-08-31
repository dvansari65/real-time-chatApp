import { useSearchUsers } from "@/lib/api/useSearchChats";
import { Search, X, User, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { partialUser } from "@/types/user";

interface GroupResult {
  id: string;
  name: string;
  description?: string;
  groupMembers?: partialUser[];
  admins:partialUser[]
  avatar:string
}

function SearchBar() {
  const [query, setQuery] = useState("");
  const [resultModal, setSearchModal] = useState(false);
  const [debounceQuery, setDebounceQuery] = useState(query);

  useEffect(() => {
    const timeOut = setTimeout(() => setDebounceQuery(query), 300);
    return () => clearTimeout(timeOut);
  }, [query]);

  const { data, isLoading, isError, error } = useSearchUsers(debounceQuery);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
    setSearchModal(value.length > 0);
  };

  const handleClose = () => {
    setSearchModal(false);
    setQuery("");
  };

  // Check if we have any results
  const hasResults = data?.success && (data?.chat?.length > 0 || data?.group?.length > 0);
  const hasChats = data?.chat?.length > 0;
  const hasGroups = data?.group?.length > 0;

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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-24">
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
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 80px)' }}>
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

              {!isLoading && !isError && !hasResults && (
                <div className="text-gray-400 text-center py-8 px-4">
                  No results found for "{query}"
                </div>
              )}

              {!isLoading && !isError && hasResults && (
                <div className="p-4 space-y-6">
                  {/* Chat Results Section */}
                  {hasChats && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-blue-400" />
                        <h4 className="text-white font-medium text-sm">
                          Users ({data.chat.length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {data.chat.map((user: partialUser) => (
                          <div
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
                                {user.email && (
                                  <div className="text-gray-400 text-sm">
                                    {user.email}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasGroups && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-green-400" />
                        <h4 className="text-white font-medium text-sm">
                          Groups ({data.group.length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {data.group.map((group: GroupResult) => (
                          <div
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
                                    {group.description}
                                  </div>
                                )}
                                {group.groupMembers && (
                                  <div className="text-gray-500 text-xs">
                                    {group.groupMembers.length} members
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
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