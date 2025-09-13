import { createServer } from "http";
import { Server } from "socket.io";
import { Socket } from "socket.io";
import { prisma } from "./src/lib/prisma";
import { NextResponse } from "next/server";
import { updateUserStatus } from "@/services/userQueries";
import { verifySession } from "@/lib/auth";

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const activeUsers = new Map<number, string>();
const socketServer = new Map<string, number>();

interface MessageData {
  content: string;
  senderId: number;
  chatId: number;
  type: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
  replyToId?: number;
}
interface UserAuthData {
  userId: number;
  username: string;
  avatar?: string;
  phoneNumber?: number;
}
interface JoinChatData {
  chatId: number;
  userId: number;
}

interface callData {
  chatId: number;
  callerId: number;
}

io.on("connection", async (socket: Socket) => {
  console.log(`user connect: ${socket.id}`);
  const session = await verifySession();
  if (!session || !session.userId) {
    return NextResponse.json({
      message: "User is not logged in!",
      success: false,
    });
  }
  const userId = session.userId;
  const isOnline = await updateUserStatus(Number(userId));
  console.log(`${session.userId} is isonline:${isOnline}`);
  socket.broadcast.emit("user-online", { userId, isOnline: isOnline });
  // user authentication
  socket.on("user_authentication", async (data: UserAuthData) => {
    try {
      console.log("user_authentication", data);
      const { userId, username } = data;
      activeUsers.set(userId, socket.id);
      socketServer.set(socket.id, userId);

      socket.emit("authentication-success", {
        userId,
        username,
        message: "Successfully authenticated",
      });
    } catch (error) {
      console.error("Authentication error:", error);
      socket.emit("error", { message: "Authentication failed" });
    }
  });
  socket.on("join-chat", async (data: JoinChatData) => {
    try {
      console.log("join room data", data);
      const { chatId, userId } = data;
      const chatExist = await prisma.chatMember.findFirst({
        where: {
          chatId: Number(chatId),
          userId: Number(userId),
        },
      });
      if (!chatExist) {
        return NextResponse.json({
          message: "chat not exist!",
          success: false,
        });
      }
      socket.join(`chat-${chatId}`);
      console.log(`${userId} joined ${chatId}`);
      socket.to(`chat-${chatId}`).emit("user-joined-chat", {
        userId,
        chatId,
        timeStamp: new Date(),
      });
    } catch (error) {
      console.error("Join chat error:", error);
      socket.emit("error", { message: "Failed to join chat" });
    }
  });
  socket.on("call-initiated", (data: callData) => {
    const { chatId, callerId } = data;
    io.to(`${chatId}`).emit("call-incoming", { chatId, callerId });
  });
  socket.on("call-accepted", ({ chatId }) => {
    io.to(chatId).emit("call-accepted", { chatId });
  });

  socket.on("call-declined", ({ chatId }) => {
    io.to(chatId).emit("call-declined", { chatId });
  });

  socket.on("call:ended", ({ chatId }) => {
    io.to(chatId).emit("call:ended", { chatId });
  });
  socket.on("send-message", async (data: MessageData) => {
    try {
      console.log("message data", data);
      const { content, senderId, replyToId, type, chatId } = data;
      const chatExist = await prisma.chatMember.findFirst({
        where: {
          userId: senderId,
          chatId: chatId,
        },
      });
      if (!chatExist) {
        socket.emit("error", {
          message: "Not authorized to send message to this chat",
        });
        return;
      }
      const message = await prisma.message.create({
        data: {
          content,
          senderId,
          replyToId,
          type,
          chatId,
          createdAt: new Date(),
        },
        include: {
          sender: {
            select: {
              username: true,
              id: true,
              avatar: true,
              isOnline: true,
              phoneNumber: true,
            },
          },
          replyTo: {
            include: {
              sender: {
                select: {
                  username: true,
                  avatar: true,
                  id: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
      });
      if (!message) {
        return socket
          .to(`${chatId}`)
          .emit("error", { message: "message not created!" });
      }
      await prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          updatedAt: new Date(),
        },
      });
      // console.log("About to CREATE messageStatus - NOT UPDATE");
      // console.log("Message ID:", message.id, "User ID:", senderId);
      await prisma.messageStatus.create({
        data: {
          messageId: message.id, // Use messageId instead of id
          userId: senderId,
          status: "DELIVERED",
          timestamp: new Date(),
        },
      });
      io.to(`chat-${chatId}`).emit("new-message", {
        message,
        timeStamp: new Date(),
      });
      socket.emit("message-delivered", {
        messageId: message?.id,
        status: "DELIVERED",
        chatId,
      });
      console.log(`Message sent in chat ${chatId} by user ${senderId}`);
    } catch (error) {
      console.log("failed to send message!", error);
      socket.emit("error", { message: "failed to send message!" });
    }
  });
  socket.on(
    "mark-as-read",
    async ({ chatId, userId }: { chatId: number; userId: number }) => {
      socket.to(`chat-${chatId}`).emit(`mark-as-read`, {
        status: "READ",
        readerId: userId,
        chatId,
      });
    }
  );
  socket.on("leave-chat", async (data: JoinChatData) => {
    const { userId, chatId } = data;
    try {
      console.log("leave chat data", userId, chatId);
      console.log("db call initiated!");
      const chat = await prisma.chatMember.findFirst({
        where: {
          chatId,
          userId: userId,
        },
      });
      console.log("chat from leave chat", chat);
      if (!chat) {
        return NextResponse.json(
          {
            message: "chat not exist!",
            success: false,
          },
          { status: 404 }
        );
      }
      socket.leave(`chat-${chatId}`);
      console.log(`${userId} left ${chatId}`);
      socket.to(`chat-${chatId}`).emit("user-left-chat", {
        userId,
        chatId,
        timeStamp: new Date(),
      });
    } catch (error) {
      console.error("failed to leave chat!", error);
      socket.emit("error", { message: "failed to leave chat!" });
    }
  });
  socket.on("disconnect", async () => {
    try {
      const userId = socketServer.get(socket.id);
      if (userId) {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            isOnline: false,
            lastSeen: new Date(),
          },
        });
      }
      activeUsers.delete(Number(userId));
      socketServer.delete(socket.id);
      socket.broadcast.emit("user-offline", { userId });
      console.log(`User ${userId} disconnected`);
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on PORT:${PORT}`);
});
