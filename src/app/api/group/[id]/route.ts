import { NextRequest, NextResponse } from "next/server";
import {prisma} from  "../../../../lib/prisma"

export const GET = async (req:NextRequest,{params}:{params:Promise<{id:string}>})=>{
    try {
        const groupId = Number((await params).id)
        const group = await prisma.group.findFirst({
            where:{
                id:groupId
            },
            include:{
                GroupMembers:{
                    select:{
                        username:true,
                        id:true,
                        avatar:true,
                        isOnline:true,
                        lastSeen:true,
                    }
                },
                admins:{
                    select:{
                        username:true,
                        id:true,
                        avatar:true,
                    }
                }
            }
        })
        if(!group){
            return NextResponse.json(
                {
                    message:"group not found!",
                    success:false
                },
                {status:404}
            )
        }
        return NextResponse.json(
            {
                success:true,
                message:"group fetched successfully!",
                group
            },
            {status:200}
        )
    } catch (error) {
        console.log("failed to fetch group!",error)
        throw error;
    }
}