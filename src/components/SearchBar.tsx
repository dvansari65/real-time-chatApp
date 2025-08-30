import { useSearchUsers } from "@/lib/api/useSearchChats";
import { Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/Button";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [resultModal, setSearchModal] = useState(false);
  const [debounceQuery, setDebounceQuery] = useState(query);

  useEffect(() => {
    const timeOut = setTimeout(() => setDebounceQuery(query), 300);
    return () => clearTimeout(timeOut);
  }, [query]);
  const { data, isLoading, isError, error } = useSearchUsers(debounceQuery);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
    setSearchModal(true);
  };
  return (
    <>
      <div className=" z-10 p-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="relative w-full h-full flex items-center">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
          />
          <Search className="absolute w-4 h-4  left-[90%] top-3 text-gray-400 mt-[6px]" />
        </div>
      </div>
      {resultModal && (
        <div className="fixed inset-0 z-50 flex flex-col items-start  bg-black/50 top-20 min-h-10 ">
          <Button onClick={()=>{
            setSearchModal(false)
            setQuery("")
          }} className="w-full flex justify-end p-2 "><X/></Button>
         
        </div>
      )}
    </>
  );
}

export default SearchBar;
