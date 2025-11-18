import type { BoardMenuProps } from "@/lib/objects/dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { CopyIcon, GlobeIcon, GlobeLockIcon, PlusIcon, User2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoardStore } from "@/lib/stores/boardStore";
import { toast } from "sonner";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserStore } from "@/lib/stores/userStore";
import { useBoardToggleMutations, useShareBoard, useUnshareBoard } from "@/lib/hooks/useBoard";

const shareSchema = z.object({
    email: z.string().email("Please enter a valid email")
})

type ShareFormValues = z.infer<typeof shareSchema>

export default function ShareDialog({ open, onOpenChange }: BoardMenuProps) {
    const selectedBoard = BoardStore(state => state.selectedBoard)
    const shareMutation = useShareBoard()
    const unshareMutation = useUnshareBoard()
    const toggleMutation = useBoardToggleMutations()
    const currentUser = UserStore((state) => state.user)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ShareFormValues>({
        resolver: zodResolver(shareSchema),
        defaultValues: { email: "" }
    })

    const handleToggle = () => {
        if (!selectedBoard?.id) return
        toggleMutation.mutate(selectedBoard.id, {
            onSuccess: (data) => {
                BoardStore.setState({ selectedBoard: data.board })
            },
        })
    }

    const onSubmit = (data: ShareFormValues) => {
        if (!selectedBoard.id) return
        shareMutation.mutate(
            { id: selectedBoard.id, email: data.email },
            {
                onSuccess: () => { toast.success("Access granted successfully"), reset() },
                onError: (e: any) => { toast.error(e.response.data.message || "Failed to add email") }
            }
        )
    }

    const handleUnshare = (userId: number) => {
        if (!selectedBoard.id) return
        unshareMutation.mutate({ id: selectedBoard.id, userId })
    }

    // const loading = toggleMutation.isPending || shareMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="space-y-1">
                    <DialogTitle>Share Board "{selectedBoard?.title}"</DialogTitle>
                    <DialogDescription>You can share this board with anyone.</DialogDescription>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mt-2">
                        <Input placeholder="Add people by their email address" {...register("email")} className="flex-1 text-sm" autoComplete="off" />
                        <Button type="submit" size="icon"><PlusIcon /></Button>
                    </form>
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </DialogHeader>
                <div className="grid space-y-2">
                    <p className="font-medium text-sm">People with access</p>
                    <div className="flex flex-row justify-start items-center gap-2">
                        <User2Icon />
                        <div className="flex flex-row items-center justify-between w-full">
                            <div>
                                <div className="flex gap-1 items-center">
                                    <p>{selectedBoard.owner.username}</p>
                                    <p className="text-sm">{selectedBoard.owner.username === currentUser?.username && "(You)"}</p>
                                </div>
                                <p className="text-muted-foreground text-sm">{selectedBoard.owner.email}</p>
                            </div>
                            <p className="text-muted-foreground text-sm">Owner</p>
                        </div>
                    </div>
                    {Array.isArray(selectedBoard?.shared_users) && selectedBoard.shared_users.length > 0 ? (
                        selectedBoard.shared_users
                            .filter((user: any) => !!user && typeof user === "object")
                            .map((user: any, index: number) => (
                                <div key={user.id ?? index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <User2Icon />
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <p>{user.username ?? "Unknown user"}</p>
                                                <p className="text-sm">{user.username === currentUser?.username && "(You)"}</p>
                                            </div>
                                            <p className="text-muted-foreground text-sm">{user?.email ?? "No email"}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => user?.id && handleUnshare(user.id)}
                                        disabled={unshareMutation.isPending}
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No shared users yet.</p>
                    )}
                </div>
                <div className="space-y-2">
                    <p className="font-medium text-sm">General Access</p>
                    <Button variant="outline" size="sm" onClick={handleToggle}>
                        {selectedBoard?.is_public ? (
                            <>
                                <GlobeLockIcon />
                                Set Private
                            </>
                        ) : (
                            <>
                                <GlobeIcon />
                                Set Public
                            </>
                        )}
                    </Button>
                    <div className="">
                        {selectedBoard?.is_public && selectedBoard?.public_url ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <Input
                                        readOnly
                                        value={`${window.location.origin}/${selectedBoard.public_id}`}
                                        className="flex-1 text-sm"
                                    />
                                    <Button variant="outline" size="icon" title="Copy URL" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/${selectedBoard.public_id}`), toast.success("Copied to clipboard") }}>
                                        <CopyIcon />
                                    </Button>

                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Only people with the link can view and people with access can edit this board.
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                This board is private. Set it public to get a shareable link.<br />People with access can still view and edit this board.
                            </p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}