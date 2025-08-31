import { verifySession } from "@/lib/auth"
import { getOrCreateChat } from "@/services/chatQueries"
import { NextResponse } from "next/server"


export const POST = async ({params}:{params:Promise<{userId:number}>})=>{
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
        if (!targetUserId || isNaN(targetUserId)) {
            return NextResponse.json(
              { message: "Invalid user ID", success: false },
              { status: 400 }
            );
          }
        const chat = await getOrCreateChat(Number(currentUserId),targetUserId)
        if(!chat){
            return NextResponse.json(
                {
                    message:"Failed to create chat!",
                    success:false
                },
                {status:500}
            )
        }
        console.log("chat data from backend!",chat)
        return NextResponse.json(
            {
                success:false,
                chat
            },
            {status:200}
        )

    } catch (error) {
        console.log("failed to create chat!",error)
        throw error;
    }
}