import Chat from "@/components/Conversation";
import InnerSidebar from "@/components/ui/Sidebars/InnerSidebar";
import OuterSidebar from "@/components/ui/Sidebars/OuterSidebar";

export default function Home() {
 return (
   <div className="w-full h-screen flex">
    <div>
      <OuterSidebar/>
    </div>
     <div className="hidden md:block">
       <InnerSidebar />
     </div>
     <div className="flex-1 flex flex-col">
       <div className="flex-1 flex justify-center items-center">
         <Chat />
       </div>
     </div>
   </div>
 );
}