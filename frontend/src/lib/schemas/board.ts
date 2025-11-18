import z from "zod";

export const createSchema = z
    .object({
        title: z.string().min(1, "Title cannot be empty."),
        lists: z.array(z.string()).min(1)
    })
    

export const renameSchema = z
    .object({
        title: z.string().min(1, "Title cannot be empty")
    })
    

export const deleteSchema = z
    .object({
        confirmTitle: z.string().min(1, "Title do not match")
    })
    

export type CreateFormValues = z.infer<typeof createSchema>
export type RenameFormValues = z.infer<typeof renameSchema>
export type DeleteFormValues = z.infer<typeof deleteSchema>
