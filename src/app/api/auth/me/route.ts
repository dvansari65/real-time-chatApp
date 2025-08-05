import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifySession } from "@/lib/auth";

export const GET = async (req: NextRequest) => {
  const session = await verifySession();
  if (!session) {
    throw new Error("failed to find session!");
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
