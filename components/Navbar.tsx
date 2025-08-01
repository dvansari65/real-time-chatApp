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
             
            </div>
          </div>
        </div>
      </nav>
    )
  }
  