import { z } from "zod";

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  phoneNumber: z.string().optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(300).optional(),
  isOnline: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
