import React from 'react'

function Skeleton1() {
  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-blue-900/20 to-purple-900/20"></div>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-500/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl animate-pulse"></div>
              <div className="w-32 h-6 bg-gradient-to-r from-white/10 to-white/5 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-5 bg-gradient-to-r from-white/10 to-white/5 rounded-lg animate-pulse hidden sm:block"></div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Skeleton1