import { NextRequest, NextResponse } from "next/server"
import {prisma} from "../../../lib/prisma"
export const GET = async (req:NextRequest)=>{
    try {
        const body =  await req.json()
        const {userId}:{userId:number} = body
        const user = await prisma.user.findFirst({
            where:{
                id:userId
            }
        })
        if(!user){
            return NextResponse.json(
                {
                    message:"User not found!",
                    success:false
                },
                {status:404}
            )
        }
        return NextResponse.json(
            {
                user,
                message:"user found!",
                success:true
            }
        )
    } catch (error:any) {
        console.log("failed to find user!",error.message)
        throw error;
    }
}