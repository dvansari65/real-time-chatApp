"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/user"


type authContextTypes = {
    user : User | null;
    setUser :(user:User | null)=>void;
    logout:()=>void;
    loading:boolean,
    setLoading:(loading:boolean)=>void
}

const AuthContext = createContext<authContextTypes | undefined>(undefined)

export const authProvider = ({children}:{children:React.ReactNode})=>{
    const [user,setUser] = useState<User | null>(null)
    const [loading,setLoading] = useState(true)
    useEffect(()=>{
        const fetchUser = async ()=>{
            try {
                const response = await fetch("/api/auth/me")
                console.log("response:",response)
                if(response.ok){
                    const data = await response.json()
                    setUser(data.user)
                }
            } catch (error:any) {
                console.log("failed to fetch user!",error)
            }finally{
                setLoading(false)
            }
        }
        fetchUser()
    },[])
    const logout = async()=>{
        try {
            await fetch("/api/auth/logout")
            setUser(null)
        } catch (error) {
            console.log("failed to logout!",error)
        }
    }
    return (
        <AuthContext.Provider value={{user,setUser,setLoading,loading,logout}} >
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = ()=>{
    const context = useContext(AuthContext)
    if(!context)throw new Error("useAuth must be used within AuthProvider");
    return context
}