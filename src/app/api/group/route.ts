import { verifySession } from "@/lib/auth";
import { createGroupInput } from "@/types/CreateGroup";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";


export const POST = async (req: NextRequest) => {
  try {
    const body: createGroupInput = await req.json();
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { error: "user is not loggedIn!" },
        { status: 400 }
      );
    }
    const UserId = session?.userId;
    if (!UserId) {
      return NextResponse.json(
        { error: "User ID not obtain from the session!" },
        { status: 403 }
      );
    }
    const { userId, admins, GroupMembers, name, discription,profileImage } = body;
    if (!userId) {
      return NextResponse.json(
        { error: "please provide user Id!" },
        { status: 400 }
      );
    }
    if (admins.length! >= 1) {
      return NextResponse.json(
        { error: "atleast one admin is required!" },
        { status: 400 }
      );
    }
    if (GroupMembers.length! >= 2) {
      return NextResponse.json(
        { error: "please provide atleast 2 members for creation of the group!" },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json({
        error: "Please provide the name of the Group!",
      });
    }
    const NewGroup = await prisma.group.create({
      data: {
        userId: Number(UserId),
        name,
        admins: {
          connect: admins.map((admin) => ({ id: admin.id })),
        },
        discription,
        profileImage,
        GroupMembers: {
          connect: GroupMembers.map((member) => ({ id: member.id })),
        },
      },
    });
    if(!NewGroup){
        return NextResponse.json(
            {error:"new group not created!"},
            {status:500}
        )
    }
    return NextResponse.json(
        {
            message:"new Group successfully created!",
            NewGroup
        },
        {status:200}
    )
  } catch (error:any) {
    console.log("failed to create new group!",error)
    return NextResponse.json(
        {error:error.message || "failed to create new group!"},
        {status:500}
    )
  }
};
