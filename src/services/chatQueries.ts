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
        return chat
    } catch (error:any) {
        console.log("failed to find chats!",error)
        throw error;
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
            throw new Error("target user not found!");
        }
        const newChat = await prisma.chat.create({
            data:{
                name:`Chat with ${targetUser.username}`,
                description: `Direct message chat`,
                isGroup:false,
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
        console.log("chat from custom api from create",newChat)
        return newChat
    } catch (error:any) {
        console.log("failed to create chat!",error)
        throw error;
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