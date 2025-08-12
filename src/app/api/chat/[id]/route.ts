import { NextRequest, NextResponse } from "next/server";
import {prisma} from "../../../../lib/prisma"
export const GET = async(req:NextRequest , {params}:{params:Promise<{id:number}>})=>{
    try {
        const chatId = (await params).id
       if(!chatId){
            return NextResponse.json(
                {message:"chatId not found!" , success:false},
                {status:404}
            )
        }
        const chat = await prisma.chat.findFirst({
            where:{
                id:Number(chatId)
            },
            select:{
                members:true,
                messages:true,
                description:true,
                id:true,
                name:true
            }
        })
        if(!chat){
            return NextResponse.json(
                {message:"no chat found"! , success:false},
                {status:404}
            )
        }
        return NextResponse.json(
            {
                success:true,
                chat
            }
        )
    } catch (error) {
        console.log("failed to load chat!",error)
        return NextResponse.json(
            {error:"failed to load chat!"},
            {status:500}
        )
    }
}