import { useState, useEffect, useRef } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import type { List, Card } from "../../types/interfaces/data";
import CardView from "./cardView";
import AddCard from "./addCard";

interface ListViewProps {
  list: List;
  onListClick?: () => void;
  onCardClick?: (card: Card) => void;
  onDeleteList?: (listId: string | number) => void;
  onRenameList?: (listId: string | number) => void;
}

export default function ListView({
  list,
  onListClick,
  onCardClick,
  onDeleteList,
  onRenameList,
}: ListViewProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleOptionClick = (callback?: (id: string | number) => void) => {
    callback?.(list.id);
    setMenuOpen(false);
  };

  return (
    <div
      className="relative min-w-[250px] p-2 bg-gray-100 dark:bg-zinc-900 cursor-pointer rounded-lg shadow transition-transform hover:scale-[1.02]"
      onClick={onListClick}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="ml-2 font-semibold">{list.title}</h2>

        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800"
          >
            <MoreHorizIcon />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-32 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleOptionClick(onRenameList)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-t-lg"
              >
                Rename
              </button>
              <button
                onClick={() => handleOptionClick(onDeleteList)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-b-lg text-red-500"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {list.cards.map((card) => (
          <div
            key={card.id}
            onClick={(e) => {
              e.stopPropagation();
              onCardClick?.(card);
            }}
          >
            <CardView card={card} />
          </div>
        ))}
        <AddCard/>
      </div>
    </div>
  );
}