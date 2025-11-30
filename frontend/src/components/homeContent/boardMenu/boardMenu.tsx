import { useState } from "react"
import { MoreHorizontalIcon, Share2Icon, Edit2Icon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import RenameDialog from "./rename"
import DeleteDialog from "./delete"
import ShareDialog from "./share"
import ActivityFeed from "../activity/activityFeed"

export default function BoardMenu() {
    const [showRenameDialog, setShowRenameDialog] = useState(false)
    const [showShareDialog, setShowShareDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    return (
        <ButtonGroup>
            <ButtonGroup>
                {/* <Input placeholder="Search..." />
                <Button variant="outline">
                    <SearchIcon />
                </Button> */}
                <ActivityFeed />
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
                            <DropdownMenuItem onSelect={() => setShowShareDialog(true)}>
                                <Share2Icon /> Export and Share
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => setShowDeleteDialog(true)}
                            >
                                <Trash2Icon /> Delete Board
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <RenameDialog open={showRenameDialog} onOpenChange={setShowRenameDialog} />

                <ShareDialog open={showShareDialog} onOpenChange={setShowShareDialog} />

                <DeleteDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} />
            </ButtonGroup>
        </ButtonGroup>
    )
}
