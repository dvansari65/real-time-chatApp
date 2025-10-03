import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "../../../../lib/auth";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: "can't find body!" }, { status: 409 });
    }
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: "please enter all the fields!" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    console.log("user",user)
    if (!user) {
      return NextResponse.json({ error: "user not found!" }, { status: 404 });
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return NextResponse.json(
        { error: "password is incorrect!" },
        { status: 400 }
      );
    }
    const recievedSession = await createSession(email, user.id.toString());
    if (!recievedSession) {
      return NextResponse.json(
        { error: "session not created!" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        user,
        session:recievedSession.session,
        message:"user logged in successfully!"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
