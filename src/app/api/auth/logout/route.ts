import { deleteSession, verifySession } from "@/lib/auth";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    const session = verifySession();
    if (!session) {
      return NextResponse.json(
        {
          message: "User already logout! Please first you have to login!",
          success: true,
        },
        { status: 400 }
      );
    }
    await deleteSession();
    return NextResponse.json(
      {
        message: "user logged out!",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to logout!",error)
    return NextResponse.json(
        {
            error:"failed to logout!"
        },
        {status:500}
    )
  }
};
