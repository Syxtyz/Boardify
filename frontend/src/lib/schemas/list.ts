import z from "zod";

export const createSchema = z
    .object({
        title: z.string().min(1, "Title cannot be empty.")
    })

export type CreateFormValues = z.infer<typeof createSchema>