import AddIcon from "@mui/icons-material/Add";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

interface CreateBoardSectionProps {
  showInput: boolean;
  setShowInput: Dispatch<SetStateAction<boolean>>;
  createBoard: (title: string) => void;
}

export default function CreateBoardSection({
  showInput,
  setShowInput,
  createBoard,
}: CreateBoardSectionProps) {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    createBoard(title.trim());
    setTitle("");
    setShowInput(false);
  }

  return (
    <>
      <div
        className="px-2 h-9 flex items-center justify-between mx-4 mt-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800"
        role="button"
        tabIndex={0}
        onClick={() => setShowInput(true)}
      >
        <h1>Create Board</h1>
        <AddIcon className="mx-1" />
      </div>

      {showInput && (
        <div className="mx-4 mt-2 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Board Title..."
            className="w-full px-2 py-1 border rounded dark:bg-zinc-800 dark:text-white"
            value={title}
            onChange ={(e) => setTitle(e.target.value)}
          />
          <button
            className="mb-2 px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      )}
    </>
  );
}
