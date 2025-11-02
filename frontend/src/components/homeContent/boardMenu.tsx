import { MoreHorizontalIcon, SearchIcon, Share2Icon, Edit2Icon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Field, FieldGroup, FieldLabel } from "../ui/field"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { BoardStore } from "@/lib/stores/boardStore"
import { toast } from "sonner"

const renameSchema = z.object({
    title: z.string().min(1, "Title cannot be empty")
})

const deleteSchema = z.object({
    confirmTitle: z.string().min(1, "Title do not match")
})

type renameFormValues = z.infer<typeof renameSchema>
type deleteFormValues = z.infer<typeof deleteSchema>

export default function BoardMenu() {
    const [showRenameDialog, setShowRenameDialog] = useState(false)
    const [showExportDialog, setShowExportDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const selectedBoard = BoardStore(state => state.selectedBoard)
    const updateBoard = BoardStore(state => state.updateBoard)
    const deleteBoard = BoardStore(state => state.deleteBoard)
    const shareBoard = BoardStore(state => state.shareBoard)

    const renameForm = useForm<z.infer<typeof renameSchema>>({
        resolver: zodResolver(renameSchema),
        defaultValues: { title: "" }
    })

    const deleteForm = useForm<z.infer<typeof deleteSchema>>({
        resolver: zodResolver(deleteSchema),
        defaultValues: { confirmTitle: "" }
    })

    const confirmTitleValue = deleteForm.watch("confirmTitle")
    const isTitleMatched = confirmTitleValue === selectedBoard?.title

    const updateSubmit = (data: renameFormValues) => {
        if (!selectedBoard?.id) return
        updateBoard(selectedBoard.id, data.title)
        closeHandle(false)
    }

    const deleteSubmit = (data: deleteFormValues) => {
        if (!selectedBoard?.id) return

        if (selectedBoard?.title === data.confirmTitle) {
            deleteBoard(selectedBoard.id)
            closeHandle(false)
        }
    }

    const closeHandle = (open: boolean) => {
        renameForm.reset()
        deleteForm.reset()
        setShowRenameDialog(open)
        setShowExportDialog(open)
        setShowDeleteDialog(open)
    };

    return (
        <ButtonGroup>
            <ButtonGroup>
                <Input placeholder="Search..." />
                <Button variant="outline">
                    <SearchIcon />
                </Button>
            </ButtonGroup>
            <ButtonGroup>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="More Options">
                            <MoreHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuItem onSelect={() => setShowRenameDialog(true)}>
                                <Edit2Icon /> Rename Board
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setShowExportDialog(true)}>
                                <Share2Icon /> Export and Share
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem variant="destructive" onSelect={() => setShowDeleteDialog(true)}>
                                <Trash2Icon /> Delete Board
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Dialog open={showRenameDialog} onOpenChange={(open) => setShowRenameDialog(open)}>
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
                                    <Input id="listtitle" {...renameForm.register("title")} placeholder={selectedBoard?.title} />
                                    {renameForm.formState.errors.title && (
                                        <p className="text-red-500 text-sm">{renameForm.formState.errors.title.message}</p>
                                    )}
                                </Field>
                            </FieldGroup>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" className="w-16">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" className="w-16">Save</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={showExportDialog} onOpenChange={(open) => setShowExportDialog(open)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Export & Share Board</DialogTitle>
                            <DialogDescription>
                                Generate a public link to share this board with others. Anyone with the link can view it.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {selectedBoard?.public_url ? (
                                <>
                                    <div className="p-3 border rounded-md flex justify-between items-center">
                                        <Input
                                            // value={selectedBoard.public_url} backend link
                                            value={`${window.location.origin}/${selectedBoard?.public_id}`} // frontend link
                                            readOnly
                                            className="text-sm truncate border-none shadow-none focus-visible:ring-0"
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                // navigator.clipboard.writeText(selectedBoard.public_url!);
                                                const shareLink = `${window.location.origin}/${selectedBoard?.public_id}`;
                                                navigator.clipboard.writeText(shareLink);
                                                toast.success("Link copied to clipboard")
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                if (!selectedBoard?.id) return;
                                                shareBoard(selectedBoard.id);
                                            }}
                                        >
                                            Regenerate Link
                                        </Button>

                                        <DialogClose asChild>
                                            <Button>Close</Button>
                                        </DialogClose>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-500">
                                        No public link yet. Click below to generate one.
                                    </p>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            onClick={async () => {
                                                if (!selectedBoard?.id) return;
                                                await BoardStore.getState().shareBoard(selectedBoard.id)
                                                console.log("Generating");
                                            }}
                                        >
                                            Generate Link
                                        </Button>

                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                    </div>
                                </>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={showDeleteDialog} onOpenChange={(open) => setShowDeleteDialog(open)}>
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
                                    <Input placeholder="Board Title" className="text-center" {...deleteForm.register("confirmTitle")} />
                                </Field>
                            </FieldGroup>

                            <DialogFooter>
                                <Button variant="outline" type="submit" className="w-full text-red-500 hover:text-red-500 cursor-pointer" disabled={!isTitleMatched}>Delete</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </ButtonGroup>
        </ButtonGroup>
    )
}