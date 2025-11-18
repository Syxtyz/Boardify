import { Button } from "@/components/ui/button"
import { useBoardToggleMutations } from "@/lib/hooks/useBoard"
import { CopyIcon, GlobeIcon, LockIcon } from "lucide-react"

interface BoardPublicToggleProps {
    boardId: number
    isPublic: boolean
    publicUrl?: string | null
}

export const BoardPublicToggle = ({ boardId, isPublic, publicUrl }: BoardPublicToggleProps) => {
    const toggleMutation = useBoardToggleMutations()

    const handleToggle = () => {
        toggleMutation.mutate(boardId)
    }

    const handleCopy = async () => {
        if (publicUrl) {
            await navigator.clipboard.writeText(publicUrl)
        }
    }

    const loading = toggleMutation.isPending

    return (
        <div className="p-4 border rounded-xl bg-card shadow-sm flex flex-col gap-3 w-full max-w-md">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Board Visibility</h2>
                <Button variant="outline" size="sm" onClick={handleToggle} disabled={loading}>
                    {loading ? "Updating..." : isPublic ? (
                        <>
                            <LockIcon className="mr-2 h-4 w-4" />
                            Set Private
                        </>
                    ) : (
                        <>
                            <GlobeIcon className="mr-2 h-4 w-4" />
                            Set Public
                        </>
                    )}
                </Button>
            </div>

            {isPublic && publicUrl ? (
                <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                    <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="truncate text-blue-600 hover:underline">
                        {publicUrl}
                    </a>
                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                        <CopyIcon className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    This board is private. Only you and shared users can view it.
                </p>
            )}
        </div>
    )
}
