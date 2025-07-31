import { NextRequest, NextResponse } from "next/server";
import { partialUser } from "../../../../../types/user";
import { error } from "console";
import { uploadFile } from "../../../../../lib/uploadAvatar";
import bcrypt from "bcryptjs";
import {prisma} from "../../../../../lib/prisma"
export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
    console.log("formdata:",formData)
  // Extract fields from FormData
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;
  const bio = (formData.get("bio") as string) || "";
  const avatar = formData.get("avatar") as File | null;
    console.log("number",phoneNumber)
    console.log("email",email)
    console.log("username",username)
    console.log("password",password)
  // Validation
  if (!username || !email || !phoneNumber || !password) {
    return NextResponse.json(
      { error: "Please fill all required fields!" },
      { status: 400 }
    );
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address!" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters long!" },
      { status: 400 }
    );
  }

  const phoneRegex = /^\+?[\d\s-()]+$/;
  if (!phoneRegex.test(phoneNumber)) {
    return NextResponse.json(
      { error: "Please provide a valid phone number!" },
      { status: 400 }
    );
  }
  let avatarUrl = "";

  if (avatar && avatar.size > 0) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(avatar.type)) {
      return NextResponse.json(
        {
          error: "wrong file type!",
        },
        {
          status: 400,
        }
      );
    }
    if (avatar?.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "file size should be less than 5mb" },
        { status: 40 }
      );
    }
    try {
      avatarUrl = await uploadFile(avatar);
    } catch (error) {
      console.log("failed to upload file!", error);
      return NextResponse.json(
        { error: "failed to upload image!" },
        { status: 500 }
      );
    }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma?.user.create({
      data: {
        username,
        phoneNumber: phoneNumber,
        avatar: avatarUrl,
        password: hashedPassword,
        email,
        bio,
      },
    });
    return NextResponse.json(
        {
            message:"user created successfully!",
            user
        },
        {status:200}
    )
  } catch (error: any) {
    console.error("failed to create user!", error);
    if (error.code === "P2002") {
        const target = error.meta?.target;
        let message = "User already exists!";
        
        if (target?.includes('email')) {
          message = "Email already registered!";
        } else if (target?.includes('username')) {
          message = "Username already taken!";
        } else if (target?.includes('phoneNumber')) {
          message = "Phone number already registered!";
        }
        
        return NextResponse.json(
          { error: message },
          { status: 409 }
        );
    }
    return NextResponse.json(
      {
        message: "failed to create user!",
      },
      {
        status: 500,
      }
    );
  }
};
