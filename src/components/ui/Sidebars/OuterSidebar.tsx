"use client";

import { SIDEBAR_LINKS } from "@/constants/sidebarLinks";
import { useAuth } from "@/contextApi";
import { ChartBarIcon, MessageCircle } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function OuterSidebar() {
  const pathname = usePathname();
  
  return (
    <>
      <div className="w-[60px] border border-r border-gray-200 h-full bg-gray-50 flex flex-col items-center justify-start py-3">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon; // Assign the icon component to a variable
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`p-3 rounded-lg ${
                  pathname === link.path
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon className="h-5 w-5" /> {/* Render as JSX element */}
              </Link>
            );
          })}
        </div>
    </>
  );
}

export default OuterSidebar;
