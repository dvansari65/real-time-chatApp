import { NextRequest, NextResponse } from "next/server"
import {prisma} from "../../../../lib/prisma"
export const GET = async (req:NextRequest,{params}:{params:Promise<{userId:string}>})=>{
    try {
        const userId = (await params).userId
        console.log("user id from backedn",userId)
        const user = await prisma.user.findFirst({
            where:{
                id:Number(userId)
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
        console.log("user from the bakedn",user)
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