import TopNavigation from "../components/topNavigation/navigation";
import BoardView from "../components/homeContent/boardView";
import { BoardStore } from "@/lib/stores/boardStore";

export default function HomeScreen() {
  const { selectedBoard } = BoardStore();

  return (
    <>
      <nav>
        <TopNavigation/>
      </nav>

      <main className="min-h-[calc(100vh-3rem)]">
          {!selectedBoard ? (
            <div className="flex justify-center items-center center">
              <h1 className="">No board selected</h1>
            </div>
          ) : (
            <BoardView/>
          )}
      </main>
    </>
  );
}
