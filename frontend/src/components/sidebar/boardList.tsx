import type { Board } from "../../types/interfaces/data";

interface BoardListProps {
  boards: Board[];
  onSelect: (boardId: number) => void;
}

export default function BoardList({ boards, onSelect }: BoardListProps) {
  return (
    <div className="flex flex-col">
      {boards.map((board) => (
        <p
          key={board.id}
          className="px-2 h-9 flex items-center mx-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800"
          onClick={() => onSelect(board.id)}
        >
          {board.title}
        </p>
      ))}
    </div>
  );
}
