import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useDeleteMutation } from "@/lib/hooks/useBoard"
import type { BoardMenuProps } from "@/lib/objects/dialog"
import { deleteSchema, type DeleteFormValues } from "@/lib/schemas/board"
import { BoardStore } from "@/lib/stores/boardStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export default function DeleteDialog({ open, onOpenChange }: BoardMenuProps) {
    const selectedBoard = BoardStore(state => state.selectedBoard)
    const deleteMutation = useDeleteMutation()

    const deleteForm = useForm<DeleteFormValues>({
        resolver: zodResolver(deleteSchema),
        defaultValues: { confirmTitle: "" },
    })

    const confirmTitleValue = deleteForm.watch("confirmTitle")
    const isTitleMatched = confirmTitleValue === selectedBoard?.title

    const deleteSubmit = (data: DeleteFormValues) => {
        if (!selectedBoard?.id) return
        if (selectedBoard.title === data.confirmTitle) {
            deleteMutation.mutate(selectedBoard.id)
        }
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogDescription>
                        To confirm, type down "{selectedBoard?.title}" in the box below
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={deleteForm.handleSubmit(deleteSubmit)}>
                    <FieldGroup className="pb-3">
                        <Field>
                            <Input
                                placeholder="Board Title"
                                className="text-center"
                                {...deleteForm.register("confirmTitle")}
                                autoComplete="off"
                            />
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            type="submit"
                            className="w-full text-red-500 hover:text-red-500 cursor-pointer"
                            disabled={!isTitleMatched || deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}