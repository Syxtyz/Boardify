import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SidebarHeader from "./sideBarHeader";
import BoardList from "./boardList";
import CreateBoardSection from "./createBoardSection";
import { BoardStore } from "@/lib/stores/boardStore";

export default function SideNavigation() {
  const loading = BoardStore(state => state.loading)
  const error = BoardStore(state => state.error)
  const [isOpen, setIsOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);

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
        onClick={() => {setIsOpen(false), setShowInput(false)}
        }
           
      >
        <div
          className={`absolute left-0 top-0 h-full w-64 bg-white dark:bg-zinc-900 shadow-lg flex flex-col transform transition-transform duration-100 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <SidebarHeader onClose={() => setIsOpen(false)} />

            <CreateBoardSection
             showInput={showInput}
             setShowInput={setShowInput}
           />

          {loading ? (
            <p className="text-center text-gray-500">Loading boards...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}.<br/>Please try again.</p>
          ) : (
            <BoardList/>
          )}
        </div>
      </div>
    </>
  );
}
