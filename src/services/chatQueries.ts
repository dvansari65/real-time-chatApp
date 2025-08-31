import { verifySession } from "@/lib/auth"
import {prisma} from "../lib/prisma"
import { NextResponse } from "next/server"


export const findExistingChat = async (currentUserId:number,targetUserId:number)=>{
    try {
        const chat = await prisma.chat.findFirst({
            where:{
                members:{
                    every:{
                        OR:[
                            {userId:currentUserId},
                            {userId:targetUserId}
                        ]
                    },
                    some:{userId:currentUserId}
                },
                AND:{
                    members:{
                        some:{userId:targetUserId}
                    }
                }
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
                                lastSeen:true,
                                email:true,
                                createdAt:true
                            }
                        }
                    }
                },
                messages:{
                    take:20,
                    orderBy:{
                        createdAt:"desc"
                    },
                    include:{
                        sender:{
                            select:{
                                username:true,
                                avatar:true
                            }
                        }
                    }
                }
            },
            
        })
        if(!chat){
            return NextResponse.json(
                {
                    message:"Chat not found!",
                    success:false
                },
                {status:404}
            )
        }
        return chat
    } catch (error:any) {
        console.log("failed to find chats!",error)
        return NextResponse.json(
            {error:error?.message || "failed to find chats!"},
            {status:500}
        )
    }
}

export const createChat = async (currentUserId:number,targetUserId:number)=>{
    try {
        const targetUser = await prisma.user.findFirst({
            where:{
                id:targetUserId
            },
            select:{
                username:true
            }
        })
        if(!targetUser){
            return NextResponse.json(
                {
                    message:"target user not found!",
                    success:false
                },
                {status:404}
            )
        }
        const newChat = await prisma.chat.create({
            data:{
                name:`Chat with ${targetUser.username}`,
                description: `Direct message chat`,
                members:{
                    create:[
                        {
                            userId:targetUserId,
                            role:"MEMBER"
                        },
                        {
                            userId:currentUserId,
                            role:"MEMBER"
                        }
                    ]
                },
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
                                email:true,
                                phoneNumber:true,
                                lastSeen:true,
                                isOnline:true,
                                createdAt:true
                            }
                        }
                    }
                },
                messages:{
                    take:20,
                    orderBy:{
                        createdAt:'desc'
                    },
                    include:{
                        sender:{
                            select:{
                                username:true,
                                avatar:true,
                                id:true
                            }
                        }
                    }
                },
                _count:{
                    select:{
                        messages:true
                    }
                }
            }
        })
        if(!newChat){
            return NextResponse.json(
                {
                    message:"failed to create chat!",
                    success:false
                },
                {status:500}
            )
        }
        return newChat
    } catch (error:any) {
        console.log("failed to create chat!",error)
        return NextResponse.json(
            {error:error?.message || "failed to create chat!"},
            {status:500}
        )
    }
}

export const getOrCreateChat = async (currentUserId:number,targetUserId:number)=>{
    try {
        let chat = await findExistingChat(currentUserId,targetUserId)
        if(!chat){
           chat = await createChat(currentUserId,targetUserId)
        }
        return chat;
    } catch (error) {
        console.log("something went wrong!",error);
        throw error;
    }
}