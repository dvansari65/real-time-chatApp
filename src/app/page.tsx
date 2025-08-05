import Chat from "@/components/Chat";
import Sidebar from "@/components/sidebar";

export default function Home() {
 return (
   <div className="w-full h-screen flex">
     <div className="hidden md:block">
       <Sidebar />
     </div>
     <div className="flex-1 flex flex-col">
       <div className="flex-1 flex justify-center items-center">
         <Chat />
       </div>
     </div>
   </div>
 );
}