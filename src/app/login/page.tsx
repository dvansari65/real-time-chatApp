"use client"
import LoginForm from '@/components/LoginForm'
import { useAuth } from '@/contextApi'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Login() {
  const {isLoading,data} = useAuth()
  const router = useRouter()
  useEffect(()=>{
    if(!isLoading){
      if(!data?.user){
        router.push("/login")
      }
    }
  },[data])

  return (
   <main>
    <LoginForm/>
   </main>
  )
}

export default Login