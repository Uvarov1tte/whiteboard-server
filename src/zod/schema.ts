import * as z from "zod"; 

export const RegisterValidation = z.object({
  username: z.string().min(3).max(20),
  name: z.string().min(3).max(20),
  password: z.string().min(6).max(20)
})

export const LogInValidation = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(20)
})

export const BoardValidation = z.object({
  title: z.string().min(3)
})