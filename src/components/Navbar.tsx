"use client";
import { useAuth } from "@/contextApi";
import Link from "next/link";
import Profile from "./Profile";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import LogoutModal from "./modal/LogoutModal";
import { useRouter } from "next/navigation";
import { Settings, UserPlus } from "lucide-react";
export function SimpleNavbar() {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const { data, isLoading, logout } = useAuth();
  // useEffect(() => {
  //   if (!isLoading) {
  //     console.log("data", data);
  //   }
  // }, []);
  const handleLogout = async () => {
   try {
    await logout();
    router.push("/login");
   } catch (error) {
    console.log("failed to logout!",error)
   }
  };
  if (isLoading) return;
  const user = data?.user;
  return (
    <nav className="bg-white shadow border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 ">
        <div className="flex justify-center items-center p-2">
        <div className="flex items-center justify-between bg-green-500 px-2 py-1 rounded-[5px] ">
          <h1 className="text-xl font-semibold">WhatsApp</h1>
        </div>
        </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2 gap-2">
                <span className="text-sm text-gray-600">
                  Welcome, {user.username || user.email}
                </span>
                <Profile
                  logout={() => setModal(true)}
                  email={user.email}
                  username={user.username}
                  avatar={user.avatar}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 bg-slate-200 px-3 py-1 rounded hover:bg-slate-100 transition-colors"
                >
                  LOGIN
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-green-600 border border-green-600 px-3 py-1 rounded hover:bg-green-50 transition-colors"
                >
                  SIGNUP
                </Link>
              </div>
            )}
          </div>
          {modal && (
            <LogoutModal
              isOpen={modal}
              onClose={() => setModal(false)}
              onConfirm={handleLogout}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
