import { chatInputTypeForGroupChat } from "@/types/chat";
import { NextRequest, NextResponse } from "next/server";
import {prisma}  from "../../../lib/prisma"

export const POST = async(req:NextRequest)=>{
    try {
        const body:chatInputTypeForGroupChat = await req.json()
        const {isGroup,name,members,description} = body;
        const potentialChats = await prisma.chat.findMany({
            where:{
                isGroup:true,
                members:{
                    some:{
                        userId:{
                            in:members.map(member=>Number(member.id))
                        },
                        leftAt:null
                    }
                }
            },
            include:{
                members:{
                    where:{
                        leftAt:null
                    }
                }
            }
        })
        console.log(" potentialChats",potentialChats)
        const memberIdsFromInputMembers = members.map(member=>Number(member?.id))
        const existinChat = potentialChats.find(chat=>{
            const memberIdsFromQueriedChat = chat?.members.map(member=>member?.userId)
            return memberIdsFromQueriedChat.length === memberIdsFromInputMembers.length &&
                            memberIdsFromQueriedChat.every((id,index)=>id === memberIdsFromInputMembers[index])
        })
        if(existinChat){
            return NextResponse.json(
                {
                    message:"chat already existed!",
                    chat:existinChat,
                    success:true
                },
                {status:200}
            )
        }
         
        const createdChat = await prisma.chat.create({
            data:{
                name,
                isGroup,
                members:{
                    create:memberIdsFromInputMembers.map(id=>({
                        userId:id,
                        role:"MEMBER"
                    }))
                },
                description
            },
            include:{
                members:{
                    include:{
                        user:{
                            select:{
                                id:true,
                                username:true,
                                avatar:true,
                                lastSeen:true,
                                isOnline:true,
                                bio:true,
                                phoneNumber:true,
                            }
                        }
                    }
                }
            }
        })
        if(!createdChat){
            return NextResponse.json(
                {
                    success:false,
                    message:"failed to create chat!"
                },
                {status:500}
            )
        }
        return NextResponse.json(
            {
                success:true,
                chat:createdChat
            },
            {status:200}
        )
        
    } catch (error:any) {
        console.log("failed to create chat!",error?.message)
        return NextResponse.json(
            {
                error:error.message || "failed to create chat!"
            },
            {status:500}
        )
    }
}