import { useQuery } from "@tanstack/react-query";
import { fetchBoards } from "@/lib/api/boardAPI";
import { Button } from "../ui/button";
import { BoardStore } from "@/lib/stores/boardStore";
import { UserStore } from "@/lib/stores/userStore";
import { Columns2Icon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export default function BoardList() {
  const { selectBoard } = BoardStore()
  const currentUser = UserStore((state) => state.user)
  const { data: boards = [], isLoading, isError } = useQuery({
    queryKey: ["boards"],
    queryFn: fetchBoards
  })

  const ownedBoards = boards.filter((board: any) => board.owner.username === currentUser?.username)
  const sharedBoards = boards.filter((board: any) => board.owner.username !== currentUser?.username)

  if (isLoading) return <p className="text-gray-400 text-center">Loading...</p>
  if (isError) return <p className="text-red-400 text-center">Error fetching boards</p>

  return (
    <ScrollArea className="h-11/12 my-4 pr-6">
      <div className="flex flex-col ">
        <p className="mb-2">Owned Boards</p>
        {ownedBoards.map((board: any) => (
          <Button
            variant="ghost"
            key={board.id}
            onClick={() => selectBoard(board.id)}
            className="h-9 rounded-lg cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 justify-start"
          >
            <Columns2Icon /> {board.title}
          </Button>
        ))}
      </div>

      <div className="mt-2 flex flex-col">
        <p className="mb-2">Shared with you</p>
        {sharedBoards.map((board: any) => (
          <Button
            variant="ghost"
            key={board.id}
            onClick={() => selectBoard(board.id)}
            className="h-9 rounded-lg cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 justify-start"
          >
            <Columns2Icon /> {board.title}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}