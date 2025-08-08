import { NextResponse } from "next/server";
import {prisma} from "../../../lib/prisma"

export const POST = async(req:NextResponse)=>{
    try {
        const body = await req.json()
        const {userID1 , userID2} = body
        const chat = await prisma.chat.findFirst({
            where:{
                AND:[
                    {
                        members:{
                            some:{
                                userId:userID1
                            }
                        }
                    },
                    {
                        members:{
                            some:{
                                userId:userID2
                            }
                        }
                    },
                    {
                        members:{
                            every:{
                                OR:[
                                    {userId:userID1},
                                    {userId:userID2}
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
        if(chat){
            return NextResponse.json({success:true , chat})
        }
        const newChat = await prisma.chat.create({
            data:{
                name:"",
                discription:"",
                createdAt:new Date,
                members:{
                    create:[
                        {userId:userID1},
                        {userId:userID2}
                    ]
                }
            },
            include:{
                members:{
                    include:{
                        user:{
                            select:{
                                username:true,
                                avatar:true,
                                phoneNumber:true,
                                isOnline:true,
                            }
                        }
                    }
                }
            }
        })
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

