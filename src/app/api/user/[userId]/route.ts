import { NextRequest, NextResponse } from "next/server"
import {prisma} from "../../../../lib/prisma"
import { updateUserSchema } from "@/lib/validations/user"
import { updateUser, UserUpdateError } from "@/services/updateUser"

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
  {params}:{params:Promise<{userId:string}>}
) {
  try {
    // Parse request body
    let body;
    let id;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    id = (await params).userId;
    // Validate user ID
    const userId = Number(id);
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Validate request data
    const parsedData = updateUserSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Check if at least one field is being updated
    if (Object.keys(parsedData.data).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await updateUser(userId, parsedData.data);

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle custom user update errors
    if (error instanceof UserUpdateError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.statusCode }
      );
    }

    // Log unexpected errors
    console.error("Unexpected error in PATCH /api/users/[id]:", error);

    // Return generic error response
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}