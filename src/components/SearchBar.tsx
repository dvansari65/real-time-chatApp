import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function SearchBar() {
  const [query,setQuery] = useState("")
  useEffect(()=>{
    
  },[])
  return (
    <div className=" z-10 p-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
    <div className="relative w-full h-full flex items-center">
     
      <input
        type="text"
        value={query}
        onChange={(e)=>setQuery(e.target.value)}
        placeholder="Search or start new chat"
        className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
      />
       <Search className="absolute w-4 h-4  left-[90%] top-3 text-gray-400 mt-[6px]" />
    </div>
  </div>
  )
}

export default SearchBar