"use client";
import { SIDEBAR_LINKS } from "@/constants/sidebarLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

function OuterSidebar() {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div className="w-[70px] border-r border-white/10 h-full bg-gray-900/95 backdrop-blur-xl flex flex-col items-center justify-start py-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-blue-900/10 to-purple-900/10"></div>
         <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-500/20 rounded-full animate-pulse"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
        <div 
          className="absolute w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
          style={{
            top: `${mouseY - 64}px`,
            left: '-32px',
            transform: 'translateY(-50%)'
          }}
        ></div>
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/50 to-transparent"></div>
        <div className="relative z-10 flex flex-col space-y-3 w-full items-center">
          {SIDEBAR_LINKS.map((link, index) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            const isHovered = hoveredLink === link.name;
            return (
              <div
                key={link.name}
                className="relative w-full flex justify-center group/item"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full animate-in slide-in-from-left duration-300"></div>
                )}
                {isHovered && (
                  <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium border border-white/10 z-50 animate-in slide-in-from-left duration-200">
                    {link.name}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45 border-l border-b border-white/10"></div>
                  </div>
                )}
                <Link
                  href={link.path}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative p-4 rounded-xl transition-all duration-300 group/link overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover/link:opacity-100 transition-all duration-300 ${isActive ? 'opacity-100' : ''}`}></div>
                  <div className="relative z-10">
                    <Icon 
                      className={`h-6 w-6 transition-all duration-300 group-hover/link:scale-110 ${
                        isActive ? 'drop-shadow-lg' : ''
                      }`}
                    />
                  </div>
                  <div className="absolute inset-0 rounded-xl opacity-0 group-active/link:opacity-100 bg-white/20 transition-opacity duration-150"></div>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full"></div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-50"></div>
      </div>

      <style jsx>{`
        @keyframes slide-in-from-left {
          from {
            transform: translateX(-8px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .slide-in-from-left {
          animation-name: slide-in-from-left;
        }
      `}</style>
    </>
  );
}

export default OuterSidebar;