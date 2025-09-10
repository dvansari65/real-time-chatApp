import { verifySession } from "@/lib/auth"
import {prisma} from "../lib/prisma"
import { NextResponse } from "next/server"


export const findExistingChat = async (currentUserId:number,targetUserId:number)=>{
    try {
        const chat = await prisma.chat.findFirst({
            where:{
                isGroup:false,
                AND:[
                    {
                        members:{
                            some:{
                                userId:currentUserId
                            }
                        }
                    },
                    {
                        members:{
                            some:{
                                userId:targetUserId
                            }
                        }
                    },
                    {
                        members:{
                            none:{
                                userId:{
                                    notIn:[currentUserId,targetUserId]
                                }
                            }
                        }
                    }
                ]
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
        console.log("chat from find chat",chat)
        return chat
    } catch (error:any) {
        console.log("failed to find chats!",error)
        throw error;
    }
}

export const createChat = async (currentUserId:number,targetUserId:number)=>{
    try {
       if(!targetUserId){
        throw new Error("Please provide target user id!")
       }
       if(!currentUserId){
        throw new Error("Please provide current user id!")
       }
       console.log("target user id from creaet chat ",targetUserId);
       
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
        return newChat
    } catch (error:any) {
        console.log("failed to create chat!",error.message)
        if(error.code === "P2002"){
            throw new Error(error.message || "chat already exist!")
        }
        throw error;
    }
}

export const getOrCreateChat = async (currentUserId:number,targetUserId:number)=>{
    try {
        let chat = await findExistingChat(currentUserId,targetUserId)
        console.log("chat from getOrCreateChat",chat)
        if(!chat){
           chat = await createChat(currentUserId,targetUserId)
        }
        return chat;
    } catch (error:any) {
        console.log("something went wrong!",error.message);
        throw error;
    }
}