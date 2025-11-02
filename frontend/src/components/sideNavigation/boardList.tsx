import { BoardStore } from "@/lib/stores/boardStore";

export default function BoardList() {
  const { fetchBoardById, boards } = BoardStore();

  return (
    <div className="flex flex-col">
      {boards.length === 0 ? (
        <p className="text-gray-400 text-center">No boards found</p>
      ) : (
        boards.map((board) => (
          <button 
            key={board.id}
            onClick={() => fetchBoardById(board.id)}
            className="px-2 h-9 flex items-center mx-4 rounded-lg cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            {board.title}
          </button>
        ))
      )}
    </div>
  )
}