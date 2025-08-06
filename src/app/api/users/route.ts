import { NextRequest, NextResponse } from "next/server";
import {prisma} from "../../../lib/prisma"

export const GET = async(req:NextRequest)=>{
    try {
        const users = await prisma.user.findMany({})
        console.log("users",users)
        if(users.length === 0){
            return NextResponse.json(
                {success:false},
                {status:404}
            )
        }
        return NextResponse.json(
            {
                success:true,
                users
            },
            {status:200}
        )
    } catch (error) {
        console.log("failed to found users!",error)
        return NextResponse.json(
            {error:"faile to find users!"},
            {status:500}
        )
    }
}