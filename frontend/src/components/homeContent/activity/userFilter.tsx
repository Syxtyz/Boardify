import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { User } from "@/lib/objects/data";
import { BoardStore } from "@/lib/stores/boardStore";
import { ActivityStore } from "@/lib/stores/activityStore";
import { useState } from "react";

export default function UserFilter() {
    const selectedBoard = BoardStore((s) => s.selectedBoard)
    const setSelectedUser = ActivityStore((s) => s.setSelectedUser)
    const user = ActivityStore((s) => s.user)
    const [ sortedByUser, setSortedByUser ] = useState("User")

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-16 cursor-pointer">{sortedByUser}</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuLabel>Users</DropdownMenuLabel>
                <DropdownMenuGroup>

                    <DropdownMenuItem
                        onClick={() => {
                            setSelectedUser("all")
                            setSortedByUser("User")
                        }}
                        className={user === "all" ? "bg-muted cursor-pointer" : "cursor-pointer"}
                    >
                        All Users
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => {
                            setSelectedUser(selectedBoard.owner.id)
                            setSortedByUser(selectedBoard.owner.username)
                        }}
                        className={user === selectedBoard.owner.id ? "bg-muted cursor-pointer" : "cursor-pointer"}
                    >
                        {selectedBoard.owner.username}
                    </DropdownMenuItem>

                    {selectedBoard.shared_users.map((u: User) => (
                        <DropdownMenuItem
                            key={u.id}
                            onClick={() => setSelectedUser(u.id)}
                            className={user === u.id ? "bg-muted cursor-pointer" : "cursor-pointer"}
                        >
                            {u.username}
                        </DropdownMenuItem>
                    ))}

                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
