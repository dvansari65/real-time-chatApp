import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifySession } from "@/lib/auth";

export const GET = async () => {

  const session = await verifySession();
  if (!session) {
    return NextResponse.json(
        { success: false, error: "No session found" },
        { status: 401 }
      );
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(session.userId),
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        phoneNumber: true,
        bio: true,
        isOnline: true,
        lastSeen: true,
      },
    });
    if (!user) {
      throw new Error("user not found!");
    }
    return NextResponse.json(
        {
            success:true,
            user
        },
        {status:200}
    );
  } catch (error) {
    console.error("failed to find user!", error);
    return null;
  }
};
