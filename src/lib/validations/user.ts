import { z } from "zod";

// Update user schema - all fields are optional so user can update any field
export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .optional(),
  
  email: z
    .string()
    .email("Invalid email format")
    .optional(),
  
  phoneNumber: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "Invalid phone number format"
    )
    .optional(),
  
  avatar: z
    .string()
    .url("Avatar must be a valid URL")
    .optional(),
  
  bio: z
    .string()
    .max(500, "Bio must not exceed 500 characters")
    .optional(),
  
  isOnline: z
    .boolean()
    .optional(),
  
  // Password should be updated through a separate endpoint for security
  // Not included here
}).strict(); // Prevents additional fields

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Example: Create user schema (for reference)
export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  
  email: z
    .string()
    .email("Invalid email format"),
  
  phoneNumber: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "Invalid phone number format"
    ),
  
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  
  avatar: z
    .string()
    .url("Avatar must be a valid URL")
    .default("https://example.com/default-avatar.png"),
  
  bio: z
    .string()
    .max(500, "Bio must not exceed 500 characters")
    .default(""),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;