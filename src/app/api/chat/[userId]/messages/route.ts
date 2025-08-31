import { NextRequest, NextResponse } from "next/server";
import {prisma} from "../../../../../lib/prisma"

export const POST = async (req:NextRequest,{params}:{params:{id:string}})=>{
    const chatId = parseInt(params.id)
    const {senderId , content , type="TEXT" , replyToId } = await req.json()
    try {
        const chatMember = await prisma?.chatMember.findFirst({
            where:{
                chatId:chatId,
                user:senderId
            }
        })
        if(!chatMember){
            return NextResponse.json(
                {error:"user is not a member of this chat!"},
                {status:400}
            )
        }
        const message = await prisma.message.create({
            data:{
                senderId,
                content,
                chatId,
                type,
                replyToId:replyToId || null

            },
            include:{
                sender:{
                    select:{
                        id:true,
                        username:true,
                        avatar:true,
                        phoneNumber:true
                    }
                },
                replyTo:{
                    include:{
                        sender:{
                            select:{
                                username:true,
                                id:true,
                                avatar:true
                            }
                        }
                    }
                }
            }
        })
        await prisma.chat.update({
            where:{
                id:chatId
            },
            data:{
                updatedAt:new Date()
            }
        })
        return Response.json({ success:true ,  message });
    } catch (error) {
        console.log("failed to send message!" , error)
        return NextResponse.json(
            {error:"failed to send message!"},
            {status:500}
        )
    }
}
