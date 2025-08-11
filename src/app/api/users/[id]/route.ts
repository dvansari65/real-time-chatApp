import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) => {
  try {
    const userId = (await params).id;
    if (!userId) throw new Error("please provide user ID");
    const user = await prisma.user.findUnique({
        where:{
            id:Number(userId)
        },
        select:{
            username:true,
            id:true,
            avatar:true,
            phoneNumber:true,
            isOnline:true,
            lastSeen:true,
        }
    });
    if(!user){
        return NextResponse.json(
            {
                success:false,
                message:"user not found!"
            },
            {status:404}
        )
    }
    return NextResponse.json(
        {
            success:true,
            user
        },
        {status:200}
    )
  } catch (error) {
    console.log("failed to find user!",error)
    return NextResponse.json(
        {error:"failed to find user!"},
        {status:500}
    )
  }
};
