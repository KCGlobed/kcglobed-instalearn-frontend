import React from "react"

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-100 border-t-primary shadow-sm"></div>
        {/* Logo or Center Pulse - Optional but adds premium feel */}
        <div className="absolute h-8 w-8 animate-pulse rounded-full bg-primary/20 flex items-center justify-center">
             <div className="h-3 w-3 rounded-full bg-primary animate-bounce"></div>
        </div>
      </div>
      <p className="mt-4 animate-pulse text-sm font-medium tracking-wide text-gray-500">
        Loading...
      </p>
    </div>
  )
}

export default PageLoader
