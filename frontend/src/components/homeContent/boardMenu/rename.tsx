import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useUpdateMutation } from "@/lib/hooks/useBoard"
import type { BoardMenuProps } from "@/lib/objects/dialog"
import { renameSchema, type RenameFormValues } from "@/lib/schemas/board"
import { BoardStore } from "@/lib/stores/boardStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogClose } from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"

export default function RenameDialog({ open, onOpenChange }: BoardMenuProps) {
    const updateMutation = useUpdateMutation()
    const selectedBoard = BoardStore(state => state.selectedBoard)

    const renameForm = useForm<RenameFormValues>({
        resolver: zodResolver(renameSchema),
        defaultValues: { title: "" },
    })

    const updateSubmit = (data: RenameFormValues) => {
        if (!selectedBoard?.id) return
        updateMutation.mutate({ id: selectedBoard.id, title: data.title },
            {
                onSuccess: () => {
                    onOpenChange(false)
                }
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Rename Board</DialogTitle>
                    <DialogDescription>
                        Provide a new title for your board. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={renameForm.handleSubmit(updateSubmit)}>
                    <FieldGroup className="pb-3">
                        <Field>
                            <FieldLabel htmlFor="listtitle">Board Title</FieldLabel>
                            <Input
                                id="listtitle"
                                {...renameForm.register("title")}
                                placeholder={selectedBoard?.title}
                            />
                            {renameForm.formState.errors.title && (
                                <p className="text-red-500 text-sm">
                                    {renameForm.formState.errors.title.message}
                                </p>
                            )}
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="w-16 cursor-pointer">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="w-16 cursor-pointer">
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}