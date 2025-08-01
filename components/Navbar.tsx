"use client"

import Link from "next/link"

export function SimpleNavbar() {
  
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
            <Link href="/login" className="text-xl font-bold text-gray-600 bg-slate-200 px-4 rounded-[3px] py-1 hover:cursor-pointer hover:bg-slate-100 ">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }
  