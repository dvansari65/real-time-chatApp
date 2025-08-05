import { ChartBarIcon, MessageCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

function OuterSidebar() {
  return (
    <div className="w-[60px] border border-r border-gray-200 h-full bg-gray-50 flex flex-col items-center justify-start py-3 ">
      <Link href="/chat">
        <MessageCircle className="text-gray-400" />
      </Link>
    </div>
  );
}

export default OuterSidebar;
