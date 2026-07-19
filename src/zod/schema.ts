import * as z from "zod";

export const RegisterValidation = z.object({
  username: z
    .string()
    .min(3, "Username must have more than 3 characters"),
  name: z
    .string()
    .min(3, "Name must have more than 3 characters"),
  password: z
    .string()
    .min(6, "Password must have between 6 and 24 characters")
    .max(20, "Password must have between 6 and 24 characters")
})

export const LogInValidation = z.object({
  username: z
    .string()
    .min(3, "Username must have more than 3 characters"),
  password: z
    .string()
    .min(6, "Password must have between 6 and 24 characters")
    .max(20, "Password must have between 6 and 24 characters")
})

export const BoardValidation = z.object({
  title: z.string().min(3, "Title must have more than 3 characters")
})