import { prisma } from "../lib/prisma";
import { UpdateUserInput } from "@/lib/validations/user";

export const updateUser = async (id: number, data: UpdateUserInput) => {
  return prisma.user.update({
    where: { id },
    data: {
      ...data,
      lastSeen: new Date(), // Best practice: update on profile change
    },
    select: {
      id: true,
      username: true,
      email: true,
      phoneNumber: true,
      avatar: true,
      bio: true,
      isOnline: true,
      lastSeen: true,
      createdAt: true,
    },
  });
};
