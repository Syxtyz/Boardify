import { z } from "zod"

export const LoginSchema = z
    .object({
        userEmail: z.string().min(1, "Username or Email is required"),
        password: z.string().min(1, "Password is required")
    })
;

export type LoginValues = z.infer<typeof LoginSchema>