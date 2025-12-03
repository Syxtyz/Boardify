import { ActivityStore } from "@/lib/stores/activityStore";
import { BoardStore } from "@/lib/stores/boardStore";
import { useEffect, useState } from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../ui/sheet";
import { Button } from "../../ui/button";
import { ScrollArea } from "../../ui/scroll-area";
import { Skeleton } from "../../ui/skeleton";
import UserFilter from "./userFilter";
import { ArrowRightIcon, HistoryIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function ActivityFeed() {
    const selectedBoard = BoardStore((s) => s.selectedBoard);

    const user = ActivityStore((s) => s.user);

    if (!user) return

    const filteredLogs = ActivityStore((s) => s.filteredLogs);
    const logs = filteredLogs();

    const loading = ActivityStore((s) => s.loading);
    const fetchLogs = ActivityStore((s) => s.fetchlogs);
    const fetchNextPage = ActivityStore((s) => s.fetchNextPage);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (selectedBoard.id && open) {
            fetchLogs(selectedBoard.id);
        }
    }, [open, selectedBoard.id]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="default">
                    <HistoryIcon />
                </Button>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader className="p-0 px-4 pt-4">
                    <div className="flex flex-row justify-between items-center">
                        <SheetClose asChild>
                            <Button
                                variant="ghost"
                                size={"icon"}
                                className="cursor-pointer"
                            >
                                <ArrowRightIcon />
                            </Button>
                        </SheetClose>
                        <SheetTitle>Audit Log</SheetTitle>
                    </div>

                    <div className="border-b"/>

                    <div className="flex items-center gap-2">
                        <p>Sort by</p>
                        <UserFilter />
                    </div>
                </SheetHeader>

                <ScrollArea className="px-4 overflow-y-auto">
                    {loading
                        ? Array.from({ length: 50 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full mb-2 rounded-md" />
                        ))
                        : logs.length > 0
                            ? logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="bg-secondary border mb-2 rounded-sm p-2"
                                >
                                    <div className="p-2 grid gap-6">
                                        <div>
                                            <strong>{log.user?.username || "Unknown User"}</strong>
                                            {": "}
                                        </div>
                                        <div className="text-left px-3">
                                            <span>{log.details}</span>
                                        </div>
                                        <div className="w-full text-right text-sm text-muted-foreground">
                                            <p>{new Date(log.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                            : !loading && <p className="text-center py-4">No activity yet.</p>}
                </ScrollArea>

                <div className="flex justify-center mb-4">
                    <Button
                        disabled={loading}
                        variant="outline"
                        onClick={() => fetchNextPage(selectedBoard.id)}
                    >
                        {!loading ? <>Load More</> : <Spinner />}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
