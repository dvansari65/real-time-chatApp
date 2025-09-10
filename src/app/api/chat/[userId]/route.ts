import { verifySession } from "@/lib/auth"
import { getOrCreateChat } from "@/services/chatQueries"
import { NextRequest, NextResponse } from "next/server"


export const POST = async (req:NextRequest,{params}:{params:Promise<{userId:string}>})=>{
    try {
        const session = await verifySession()
        if(!session || !session?.userId){
            return NextResponse.json(
                {
                    message:"Please logged In first!",
                    success:false
                },
                {status:401}
            )
        }
        const currentUserId = session?.userId
        const targetUserId = (await params).userId
        console.log("target user id ",targetUserId)
        if (!targetUserId || isNaN(Number(targetUserId))) {
            return NextResponse.json(
              { message: "Invalid user ID", success: false },
              { status: 400 }
            );
          }
        const chat = await getOrCreateChat(Number(currentUserId),Number(targetUserId))
        if(!chat){
            return NextResponse.json(
                {
                    message:"Failed to create chat!",
                    success:false
                },
                {status:500}
            )
        }
        return NextResponse.json(
            {
                success:true,
                chat
            },
            {status:200}
        )

    } catch (error) {
        console.log("failed to create chat!",error)
        throw error;
    }
}