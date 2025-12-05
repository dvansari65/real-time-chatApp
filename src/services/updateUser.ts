import { prisma } from "../lib/prisma";
import { UpdateUserInput } from "@/lib/validations/user";
import { Prisma } from "@prisma/client";

export class UserUpdateError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "UserUpdateError";
  }
}

export const updateUser = async (id: number, data: UpdateUserInput) => {
  console.log("user id",id)
  try {
  
    // Check if user exists first
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingUser) {
      throw new UserUpdateError(
        "User not found",
        "USER_NOT_FOUND",
        404
      );
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        lastSeen: new Date(),
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

    return updatedUser;
  } catch (error) {
    // Re-throw custom errors
    if (error instanceof UserUpdateError) {
      throw error;
    }

    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint violation
      if (error.code === "P2002") {
        const field = (error.meta?.target as string[])?.[0] || "field";
        throw new UserUpdateError(
          `This ${field} is already taken`,
          "DUPLICATE_FIELD",
          409
        );
      }

      // Record not found (shouldn't happen due to check above, but just in case)
      if (error.code === "P2025") {
        throw new UserUpdateError(
          "User not found",
          "USER_NOT_FOUND",
          404
        );
      }

      // Foreign key constraint violation
      if (error.code === "P2003") {
        throw new UserUpdateError(
          "Invalid reference in update data",
          "INVALID_REFERENCE",
          400
        );
      }
    }

    // Handle validation errors
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new UserUpdateError(
        "Invalid data format provided",
        "VALIDATION_ERROR",
        400
      );
    }

    // Handle database connection errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new UserUpdateError(
        "Database connection failed",
        "DB_CONNECTION_ERROR",
        503
      );
    }

    // Generic error fallback
    console.error("Unexpected error in updateUser:", error);
    throw new UserUpdateError(
      "An unexpected error occurred while updating user",
      "INTERNAL_ERROR",
      500
    );
  }
};