import { ActivityStore } from "@/lib/stores/activityStore"
import { BoardStore } from "@/lib/stores/boardStore"
import { useEffect, useState } from "react"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../../ui/sheet"
import { Button } from "../../ui/button"
import { Spinner } from "../../ui/spinner"
import { ScrollArea } from "../../ui/scroll-area"
import UserFilter from "./userFilter"

export default function ActivityFeed() {
    const selectedBoard = BoardStore((s) => s.selectedBoard)

    const user = ActivityStore((s) => s.user)

    const filteredLogs = ActivityStore((s) => s.filteredLogs)
    const logs = filteredLogs()

    const loading = ActivityStore((s) => s.loading)
    const fetchLogs = ActivityStore((s) => s.fetchlogs)

    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (selectedBoard.id && open) {
            fetchLogs(selectedBoard.id)
        }
    }, [open])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant={"outline"} size={"icon"} className="w-16">History</Button>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Audit Log</SheetTitle>
                    <SheetDescription></SheetDescription>

                    {/* <div className="flex gap-1.5">
                        <Input placeholder="Search..." />
                        <Button variant="outline" className="w-16">Filter</Button>
                    </div> */}

                    <div className="flex gap-1.5 items-center">
                        <p>Sort by</p>
                        <UserFilter />
                    </div>
                </SheetHeader>

                <div className="flex items-center gap-4 h-full absolute self-center">
                    {loading && <Spinner className="size-8" />}
                    {!loading && logs.length === 0 && <p>No activity yet.</p>}
                </div>

                <ScrollArea className="h-[calc(100vh-26%)] px-4 -mt-6.5">
                {/* <ScrollArea className="h-[calc(100vh-32%)] px-4 -mt-6.5"> */}
                    {!loading && logs.length > 0 && logs.map((log) => (
                        <div key={log.id} className="bg-secondary border mb-2 rounded-sm p-2">
                            <div className="grid gap-2">
                                <div>
                                    <strong>{log.user?.username || "Unknown User"}</strong>{": "}
                                    <span>{log.details}</span>
                                </div>
                                <em>({new Date(log.timestamp).toLocaleString()})</em>
                            </div>
                        </div>
                    ))}
                </ScrollArea>

                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline" className="cursor-pointer">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
