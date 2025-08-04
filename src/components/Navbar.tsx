"use client";
import { useAuth } from "@/contextApi";
import Link from "next/link";
import Profile from "./Profile";
import { toast } from "sonner";

export function SimpleNavbar() {
  const { user, loading } = useAuth();

  const handleLogout = async()=>{
    try {
      const res = await fetch("/api/auth/logout",{
        method:"POST"
      })
      const data = await res.json()
      if(!res.ok){
        toast.error(data.message || "failed to logout!")
      }
      toast.success(data.message || "logged out successfully!")
      console.log("user",user)
    } catch (error) {
      console.log("failed to logout!",error)
    }
  }
  return (
    <nav className="bg-white shadow border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-green-600">
              WhatsApp Clone
            </Link>
          </div>

          {/* Auth */}
          <div className="flex items-center space-x-4">
            {loading ? (
              // Loading state - show skeleton or spinner
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : user ? (
              // User is logged in - show logout or profile options
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Welcome, {user.username || user.email}
                </span>
                <Profile logout={handleLogout} email={user.email} username={user.username} avatar={user.avatar}/>
                
              </div>
            ) : (
              // User is not logged in - show login and signup
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
        </div>
      </div>
    </nav>
  );
}