import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { cache } from "react";
import { verifySession } from "./auth";
import {prisma} from "./prisma"



export const getUser = cache( async (req:NextRequest)=>{
   const session = await verifySession()
   if(!session){
    throw new Error("failed to find session!")
   }
   try {
        const user = await prisma.user.findUnique({
            where:{
                id:Number(session.userId)
            },
            select:{
                email:true,
                username:true,
                avatar:true,
                password:false
            }
        })
        if(!user){
            throw new Error("user not found!")
        }
        return user;

   } catch (error) {
    console.error("failed to find user!",error)
    return null;
   }
})