import { NextRequest, NextResponse } from "next/server"
import {prisma} from "../../../../lib/prisma"
import { updateUserSchema } from "@/lib/validations/user"
import { updateUser } from "@/services/updateUser"
export const GET = async (req:NextRequest,{params}:{params:Promise<{userId:string}>})=>{
    try {
        const userId = (await params).userId
        console.log("user id from backedn",userId)
        const user = await prisma.user.findFirst({
            where:{
                id:Number(userId)
            }
        })
        if(!user){
            return NextResponse.json(
                {
                    message:"User not found!",
                    success:false
                },
                {status:404}
            )
        }
        console.log("user from the bakedn",user)
        return NextResponse.json(
            {
                user,
                message:"user found!",
                success:true
            }
        )
    } catch (error:any) {
        console.log("failed to find user!",error.message)
        throw error;
    }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const parsedData = updateUserSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsedData?.error },
        { status: 400 }
      );
    }

    const userId = Number(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const updatedUser = await updateUser(userId, parsedData.data);

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
