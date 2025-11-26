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
import { fetchBoardById } from "@/lib/api/boardAPI";
import type { User } from "@/lib/objects/data";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const shareSchema = z.object({
    email: z.string().email("Please enter a valid email")
})

type ShareFormValues = z.infer<typeof shareSchema>

export default function ShareDialog({ open, onOpenChange }: BoardMenuProps) {
    const selectedBoard = BoardStore(state => state.selectedBoard)
    const shareMutation = useShareBoard()
    const unshareMutation = useUnshareBoard()
    const toggleMutation = useBoardToggleMutations()
    const currentUser = UserStore(state => state.user)
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ShareFormValues>({
        resolver: zodResolver(shareSchema),
        defaultValues: { email: "" }
    })

    // Refetch board from backend and update store
    const refreshBoard = async (showSkeleton: boolean = false) => {
    if (!selectedBoard?.id) return;
    try {
        if (showSkeleton) setLoading(true);
        const updatedBoard = await fetchBoardById(selectedBoard.id);
        BoardStore.setState({ selectedBoard: updatedBoard });
    } catch (err) {
        toast.error("Failed to refresh board");
    } finally {
        if (showSkeleton) setLoading(false);
    }
}


    const handleToggle = async () => {
    if (!selectedBoard?.id) return;
    try {
        await toggleMutation.mutateAsync(selectedBoard.id);
        await refreshBoard(false); // don't show skeleton
    } catch (err) {
        toast.error("Failed to toggle board access");
    }
}


    const onSubmit = async (data: ShareFormValues) => {
    if (!selectedBoard?.id) return;
    try {
        await shareMutation.mutateAsync({ id: selectedBoard.id, email: data.email });
        reset();
        toast.success("Access granted successfully");
        await refreshBoard(true); // show skeleton for share
    } catch (e: any) {
        toast.error(e.response?.data?.message || "Failed to add email");
    }
}

    const handleUnshare = async (userId: number) => {
    if (!selectedBoard?.id) return;
    try {
        await unshareMutation.mutateAsync({ id: selectedBoard.id, userId });
        await refreshBoard(false); // don't show skeleton
    } catch (e: any) {
        toast.error("Failed to remove user");
    }
}

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="space-y-1">
                    <DialogTitle>Share Board "{selectedBoard?.title}"</DialogTitle>
                    <DialogDescription>You can share this board with anyone.</DialogDescription>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mt-2">
                        <Input placeholder="Add people by their email address" {...register("email")} className="flex-1 text-sm" autoComplete="off" />
                        <Button type="submit" size="icon" className="cursor-pointer"><PlusIcon /></Button>
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
                                    <p>{selectedBoard?.owner.username}</p>
                                    {selectedBoard?.owner.username === currentUser?.username && <p className="text-sm">(You)</p>}
                                </div>
                                <p className="text-muted-foreground text-sm">{selectedBoard?.owner.email}</p>
                            </div>
                            <p className="text-muted-foreground text-sm">Owner</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center space-x-4 -ml-0.5">
                            <Skeleton className="rounded-full h-6 w-6"/>
                            <div className="space-y-2 -ml-2">
                                <Skeleton className="h-4 w-72"/>
                                <Skeleton className="h-4 w-72"/>
                            </div>
                            <Skeleton className="ml-1.5 h-8 w-8"/>
                        </div>
                    ) : (
                        Array.isArray(selectedBoard?.shared_users) && selectedBoard.shared_users.length > 0 ? (
                            selectedBoard.shared_users
                                .filter((user: User) => !!user && typeof user === "object")
                                .map((user: User) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <User2Icon />
                                            <div>
                                                <div className="flex items-center gap-1">
                                                    <p>{user.username ?? "Unknown user"}</p>
                                                    {user.username === currentUser?.username && <p className="text-sm">(You)</p>}
                                                </div>
                                                <p className="text-muted-foreground text-sm">{user.email ?? "No email"}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => user?.id && handleUnshare(user.id)}
                                            disabled={unshareMutation.isPending}
                                            className="cursor-pointer"
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No shared users yet.</p>
                        )
                    )}
                </div>

                <div className="space-y-2">
                    <p className="font-medium text-sm">General Access</p>
                    <Button variant="outline" size="sm" onClick={handleToggle} className="cursor-pointer">
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

                    {selectedBoard?.is_public && selectedBoard?.public_url ? (
                        <div className="flex flex-col gap-2 mt-2">
                            <div className="flex items-center gap-2">
                                <Input
                                    readOnly
                                    value={`${window.location.origin}/${selectedBoard.public_id}`}
                                    className="flex-1 text-sm"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    title="Copy URL"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/${selectedBoard.public_id}`);
                                        toast.success("Copied to clipboard");
                                    }}
                                >
                                    <CopyIcon />
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Only people with the link can view and people with access can edit this board.
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground mt-2">
                            This board is private. Set it public to get a shareable link.<br />
                            People with access can still view and edit this board.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
