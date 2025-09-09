import { NextRequest, NextResponse } from "next/server";
import {prisma} from "../../../lib/prisma"
import { error } from "console";
import { verifySession } from "@/lib/auth";

export const GET = async ()=>{
    const session = await verifySession()
    if(!session){
        return NextResponse.json(
            {error:"please login first!"},
            {status:401}
        )
    }
    try {
        const chats = await prisma.chat.findMany({
            where:{
                members:{
                    some:{
                        userId:parseInt(session?.userId)
                    }
                }
            },
            orderBy:{
                updatedAt:"desc"
            },
            include:{
                members:{
                    include:{
                        user:{
                            select:{
                                id:true,
                                username:true,
                                avatar:true,
                                bio:true,
                                phoneNumber:true,
                                isOnline:true,
                                lastSeen:true
                            }
                        }
                    }
                },
                messages:{
                    include:{
                        sender:{
                            select:{
                                username:true
                            }
                        }
                    }
                },
        
            },
        })
        if(chats.length === 0 || !chats){
            return NextResponse.json(
                {
                    success:true,
                    chats:[]
                },
                {status:404}
            )
        }
        return NextResponse.json(
            {
                success:true,
                chats
            },
            {status:200}
        )
    } catch (error:any) {
        console.log("failed to find chats!",error)
        return  NextResponse.json(
            {error:error.message || "failed to find chats!"},
            {status:500}
        )
    }
}