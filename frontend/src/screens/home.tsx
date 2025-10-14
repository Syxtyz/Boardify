import FooterContent from "../components/footerContent";
import TopNavigation from "../navigations/top";
import { useState } from "react";
import type { Board } from "../types/interfaces/data";
import BoardView from "../components/homeContent/boardView";

export default function HomeScreen() {
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  return (
    <>
      <nav>
        <TopNavigation onBoardSelect={setSelectedBoard} />
      </nav>

      <main className="p-4 min-h-[calc(100vh-3rem)] flex flex-col gap-4">
        {!selectedBoard ? (
          <div className="text-center mt-10">
            <h1>No board selected</h1>
          </div>
        ) : (
          <BoardView selectedBoard={selectedBoard} />
        )}
      </main>

      <footer>
        <FooterContent />
      </footer>
    </>
  );
}
