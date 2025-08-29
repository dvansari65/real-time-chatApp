import { NextRequest, NextResponse } from "next/server";
import {prisma} from "../../../lib/prisma"
import { error } from "console";
import { verifySession } from "@/lib/auth";

export const POST = async(req:NextRequest)=>{
    try {
        const body = await req.json()
        
        const {userId1 , userId2}:{userId1:number,userId2:number} = body
        const chat = await prisma.chat.findFirst({
            where:{
                AND:[
                    {
                        members:{
                            some:{
                                userId:userId1
                            }
                        }
                    },
                    {
                        members:{
                            some:{
                                userId:userId2
                            }
                        }
                    },
                    {
                        members:{
                            every:{
                                OR:[
                                    {userId:userId1},
                                    {userId:userId2}
                                ]
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
                                username:true,
                                id:true,
                                avatar:true,
                                phoneNumber:true,
                                isOnline:true

                            }
                        }
                    }
                }
            }
        })
        console.log("chat",chat)
        if(chat){
            return NextResponse.json({success:true , chat})
        }
        const newChat = await prisma.chat.create({
            data:{
                name:"",
                description:"",
                createdAt:new Date(),
                members:{
                    create:[
                        {userId:userId1},
                        {userId:userId2}
                    ]
                }
            },
            include:{
                members:{
                    include:{
                        user:{
                            select:{
                                id: true,
                                username: true,
                                avatar: true,
                                phoneNumber: true,
                                isOnline: true
                            }
                        }
                    }
                }
            }
        })
        console.log("new chat",newChat);
        
        return NextResponse.json(
            {
                success:true,
                chat:newChat
            }
        )
    } catch (error) {
        console.log("failed to create chat!",error )
        return NextResponse.json(
            {error:"failed to create chat!"},
            {status:500}
        )
    }
}

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
            include:{
                members:{
                    include:{
                        user:{
                            select:{
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
                    include:{}
                }
            }
            
        })
        if(chats.length === 0){
            return NextResponse.json(
                {message:"chats not found!"},
                {status:404}
            )
        }
        console.log("chats from backend",chats);
        
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