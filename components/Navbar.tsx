"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"

export function SimpleNavbar() {
    const { data: session, status } = useSession()
  
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
              {status === 'loading' ? (
                <div className="animate-spin w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full"></div>
              ) : session ? (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, {session.user?.name || session.user?.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => signIn()}
                    className="text-gray-600 hover:text-green-600"
                  >
                    Sign In
                  </button>
                  <Link
                    href="/signup"
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
  }
  