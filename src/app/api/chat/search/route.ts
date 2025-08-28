import { NextRequest, NextResponse } from "next/server"
import {prisma} from "../../../../lib/prisma"
export const GET = async (req:NextRequest)=>{
    try {
        const searchParams = req.nextUrl.searchParams
        const query = searchParams.get("params")
        if(!query){
            throw new Error("query not found!")
        }
        const chat = await prisma.chat.findMany({
            where:{
                name:{
                    contains:String(query),
                    mode:"insensitive"
                }
            },
            orderBy:{
                createdAt:"desc"
            },
            take:7
        })
        if(!chat){
            return NextResponse.json(
                {error:"chats not found!"},
                {status:404}
            )
        }
        console.log("chats",chat);
        
        return NextResponse.json({
            success:true,
            chat
        })
    } catch (error:any) {
        console.log("failed to find chats!",error)
        return new Error(error.message || "failed to find chats!")
    }
}