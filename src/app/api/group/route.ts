import { verifySession } from "@/lib/auth";
import { createGroupInput } from "@/types/CreateGroup";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { uploadFile } from "@/lib/uploadAvatar";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    console.log("formdata", formData);
    const profileImage = formData.get("profileImage") as File | null;
    const bodyData = formData.get("data") as string;
    const body = JSON.parse(bodyData) as createGroupInput;
    console.log("Received profileImage:", profileImage);
    console.log("Parsed body data:", body);
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

    if (!body?.userId) {
      return NextResponse.json(
        { error: "please provide user Id!" },
        { status: 400 }
      );
    }
    if (body?.admins.length === 0) {
      return NextResponse.json(
        { error: "atleast one admin is required!" },
        { status: 400 }
      );
    }
    if (body?.GroupMembers.length < 2) {
      return NextResponse.json(
        {
          error: "please provide atleast 2 members for creation of the group!",
        },
        { status: 400 }
      );
    }
    if (!body?.name) {
      return NextResponse.json({
        error: "Please provide the name of the Group!",
      });
    }
    try {
      if (profileImage) {
        console.log("profileImage", profileImage);

        await uploadFile(profileImage);
      }
    } catch (error) {
      console.error("failed to upload profile image!", error);
      throw error;
    }
    const NewGroup = await prisma.group.create({
      data: {
        userId: Number(UserId),
        name: body?.name,
        admins: {
          connect: body?.admins.map((admin) => ({ id: admin.id })),
        },
        discription: body?.discription,
        profileImage: String(profileImage),
        GroupMembers: {
          connect: body?.GroupMembers.map((member) => ({ id: member.id })),
        },
      },
    });
    if (!NewGroup) {
      return NextResponse.json(
        { error: "new group not created!" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        message: "new Group successfully created!",
        NewGroup,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("failed to create new group!", error);
    return NextResponse.json(
      { error: error.message || "failed to create new group!" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { userId }: { userId: number } = body;
    const groups = await prisma.group.findMany({
      where: {
        GroupMembers: {
          some: {
            id: userId,
          },
        },
      },
    });
    if (groups.length === 0) {
      return NextResponse.json(
        {
          message: "No Groups Found!",
          success: false,
        },
        {
          status: 404,
        }
      );
    }
    console.log("groups :", groups);
    return NextResponse.json(
      {
        message: "Groups Fetched Successfully!",
        groups,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("failed to find groups!", error);
    return NextResponse.json(
      { error: error.message || "failed to find groups!" },
      { status: 500 }
    );
  }
};
