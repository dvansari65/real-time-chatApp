"use client";

import { useAuth } from "@/contextApi";
import Link from "next/link";
import Profile from "./Profile";
import {  useState } from "react";
import LogoutModal from "./modal/LogoutModal";
import { useRouter } from "next/navigation";
import { ArrowRight, MessageSquare} from "lucide-react";
import Skeleton1 from "./ui/Skeleton/Skeleton1";

export function SimpleNavbar() {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const { data, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.log("failed to logout!", error);
    }
  };

  if (isLoading) return <Skeleton1 />;
  const user = data?.user;

  return (
    <div>
      <nav className="bg-gray-900/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50  ">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-blue-900/20 to-purple-900/20"></div>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-500/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <div className="flex items-center space-x-3 transition-all duration-300 group-hover:scale-105">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                  ChatConnect
                </h1>
              </div>
            </Link>
            <div className="flex items-center gap-6">
              {user ? (
                <>
                  <div className="hidden sm:flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300 font-medium">
                      Welcome,{" "}
                      <span className="text-blue-300">
                        {user.username || user?.email?.split("@")[0]}
                      </span>
                    </span>
                  </div>
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <Profile
                      logout={() => setModal(true)}
                      email={String(user?.email)}
                      username={user.username as string}
                      avatar={user.avatar as string}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="group relative px-6 py-2.5 text-sm font-semibold text-gray-300 rounded-xl hover:text-white transition-all duration-300 overflow-hidden border border-white/20 hover:border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                  >
                    <span className="relative z-10 transition-colors duration-300">
                      Login
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link
                    href="/signup"
                    className="group relative px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-300 overflow-hidden hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300"></div>
                    <span className="relative z-10 flex items-center space-x-2">
                      <span>Sign Up</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
      </nav>
      {modal && (
        <LogoutModal
          isOpen={modal}
          onClose={() => setModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}
