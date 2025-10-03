import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AddIcon from "@mui/icons-material/Add";

interface Board {
  id: number;
  title: string;
}

export default function SideNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [title, setTitle] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/boards/");
      const data = await response.json();
      setBoards(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addBoard = async () => {
    if (!title.trim()) return;
    const boardData = { title };
    try {
      const response = await fetch("http://127.0.0.1:8000/boards/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(boardData),
      });

      const data = await response.json();
      setBoards((prev) => [...prev, data]);
      setTitle("");
      setShowInput(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <button
        className="flex items-center rounded-lg cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-zinc-800"
        onClick={() => setIsOpen(true)}
        aria-label="Open side navigation"
      >
        <MenuIcon />
      </button>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-100 ease-in-out bg-[rgba(0,0,0,0.3)] ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
            setIsOpen(false);
            setShowInput(false);
        }}
        aria-hidden={!isOpen}
      >
        <div
          className={`absolute left-0 top-0 h-full w-64 bg-white dark:bg-zinc-900 shadow-lg flex flex-col transform transition-transform duration-100 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-12 flex items-center gap-2 px-4">
            <button
              className="flex items-center rounded-lg cursor-pointer p-2"
              onClick={() => {
                setIsOpen(false);
                setShowInput(false);
            }}
              aria-label="Close side navigation"
            >
              <MenuOpenIcon />
            </button>
            <h2 className="font-bold text-lg">Your Boards</h2>
          </div>

          <div className="border-t border-zinc-900 mx-2 dark:border-neutral-200" />

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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-2 py-1 border rounded dark:bg-zinc-800 dark:text-white"
              />
              <button
                className="mb-2 px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                onClick={addBoard}
              >
                Add
              </button>
            </div>
          )}

          <div className="flex flex-col">
            {boards.map((board) => (
              <p
                key={board.id}
                className="bg-red-500 px-2 h-9 flex items-center mx-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800"
              >
                {`${board.id}. ${board.title}`}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
