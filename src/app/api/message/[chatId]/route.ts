import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) => {
  try {
    const chatId = (await params).chatId;
    if(!chatId || isNaN(Number(chatId))){
        throw new Error("Please provide chat id!")
    }
    const chat = await prisma.chat.findFirst({
      where: {
        id: Number(chatId),
      },
      include: {
        messages: {
            take:30,
            select: {
            id: true,
            content: true,
            senderId: true,
            type: true,
            chatId: true,
            replyToId: true,
            createdAt: true,
            updatedAt: true,
            sender: {
              select: {
                username: true,
                id: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    if (!chat) {
      return NextResponse.json(
        { message: "chat not found!", success: false },
        { status: 404 }
      );
    }
    return NextResponse.json(
        { message: "chat  found!", success: true , chat },
        { status: 200 }
      );
    
  } catch (error) {
    console.log("failed fetch chat!",error)
    throw error;
  }
};
