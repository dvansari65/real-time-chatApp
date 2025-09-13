import { chatInputTypeForGroupChat } from "@/types/chat";
import { NextRequest, NextResponse } from "next/server";
import {prisma}  from "../../../../lib/prisma"
import { error } from "console";

export const POST = async(req:NextRequest,{params}:{params:Promise<{groupId:string}>})=>{
    try {

        const groupId = (await params).groupId
        console.log("groupd from backend",groupId)
        const body:chatInputTypeForGroupChat = await req.json()
        const {isGroup,name,members,description} = body;
        // console.log("members",members)
        const existinChat = await prisma.chat.findFirst({
            where:{
                isGroup:true,
                groupId:Number(groupId)
            },
            include:{
                members:{
                    where:{
                        leftAt:null
                    },
                    
                },
                messages:{}
            }
        })
        console.log(" existinChat",existinChat)
        if(existinChat){
            return NextResponse.json(
                {
                    message:"chat fround!",
                    success:true,
                    chat:existinChat
                }
            )
        }
       
        const createdChat = await prisma.chat.create({
            data:{
                name,
                isGroup,
                groupId:Number(groupId),
                members:{
                    create:members.map(member=>({
                        user:{
                            connect:{
                                id:member.id
                            }
                        }
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

export const GET = async(req:NextRequest,{params}:{params:Promise<{groupId:string}>})=>{
    try {
        const groupId = (await params).groupId
        if(!groupId){
            throw new Error("Please provide group ID!")
        }
        const chat = await prisma.chat.findFirst({
            where:{
                isGroup:true,
                groupId:Number(groupId)
            },
            include:{
                members:{},
                messages:{}
            }
        })
        if(!chat){
            return NextResponse.json(
                {
                    message:"chat not found!",
                    success:false
                },
                {status:404}
            )
        }
        return NextResponse.json(
            {
                message:"Group chat data fetched successfully!",
                success:true,
                chat
            },
            {status:200}
        )
    } catch (error:any) {
        console.log("failed to fetch group chat!",error)
        return NextResponse.json(
            {
                message:error.message,
                success:false
            },
            {status:500}
        )
    }
}