import { NextRequest, NextResponse } from "next/server"
import {prisma} from "../../../../lib/prisma"
export const GET = async (req:NextRequest)=>{
    try {
        const searchParams = req.nextUrl.searchParams
        const query = searchParams.get("search")
        if(!query){
            return NextResponse.json(
                {message:"Please provide query!"},
                {status:400}
            )
        }
        const searchTerm = String(query).trim()
        const user = await prisma.user.findMany({
            where:{
                OR:[
                    {
                        username:{
                            contains:searchTerm
                        }
                    },
                    {
                        phoneNumber:{
                            contains:searchTerm
                        }
                    },
                    {
                        email:{
                            contains:searchTerm
                        }
                    }
                ]
            },
            select:{
                id:true,
                username:true,
                email:true,
                phoneNumber:true,
                avatar:true,
                isOnline:true,
                lastSeen:true,
                bio:true,
                createdAt:true
            },
            orderBy:{
                createdAt:"desc"
            },
            take:5
        })
        const group = await prisma.group.findMany({
            where:{
                OR:[
                    {
                        name:{
                            contains:searchTerm
                        },
                        discription:{
                            contains:searchTerm
                        }
                    }
                ]
            },
            include:{
                GroupMembers:{},
                admins:{}
            },
            
        })
        // console.log("group from bakcend",group)
        // console.log("chats",chat);
        return NextResponse.json({
            success:true,
            user,
            group
        })
    } catch (error:any) {
        console.log("failed to find chats!",error)
        return NextResponse.json(
            {
                success:false,
                chat:[],
                group:[]
            },
            {status:500}
        )
    }
}