"use client"
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'
interface ProvidersProps {
    children: ReactNode
  }
  
function Providers({children}:ProvidersProps) {

  return (
   <SessionProvider>
    {children}
   </SessionProvider>
  )
}

export default Providers