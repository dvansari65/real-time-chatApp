"use client"
import Chat from "@/components/Conversation";
import InnerSidebar from "@/components/ui/Sidebars/InnerSidebar";
import OuterSidebar from "@/components/ui/Sidebars/OuterSidebar";
import { useFetchUsers } from "@/hooks/useFetchUser";
import { useEffect } from "react";

export default function Home() {
  const {loading , error , data , fetchUsers} = useFetchUsers()
  useEffect( ()=>{
    console.log("users",data)
    fetchUsers()
  },[])


 return (
   <div className="w-full h-screen flex">
    <div> 
      <OuterSidebar/>
    </div>
     <div className="hidden md:block">
      {
        data.map(i=>(
          <div key={}>
            <InnerSidebar  />
          </div>
        ))
      }
     <InnerSidebar    />
     </div>
     <div className="flex-1 flex flex-col">
       <div className="flex-1 flex justify-center items-center">
         <Chat />
       </div>
     </div>
   </div>
 );
}