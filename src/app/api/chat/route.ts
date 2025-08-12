import { NextRequest, NextResponse } from "next/server";
import {prisma} from "../../../lib/prisma"

export const POST = async(req:NextRequest)=>{
    try {
        const body = await req.json()
        
        const {userId1 , userId2} = body
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

