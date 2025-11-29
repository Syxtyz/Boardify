import TopNavigation from "../components/topNavigation/navigation";
import BoardView from "../components/homeContent/boardView";
import { BoardStore } from "@/lib/stores/boardStore";
import SideNavigation from "@/components/sideNavigation/navigation";

export default function HomeScreen() {
  const { selectedBoard } = BoardStore();

  return (
    <>
      <nav>
        <TopNavigation/>
      </nav>

      <main className="min-h-[calc(100vh-3rem)]">
          {!selectedBoard ? (
            <div className="justify-center items-center flex flex-col h-[calc(100vh-3rem)] gap-4">
              <h1>No board selected</h1>
              <SideNavigation homeClicked={true}/>
            </div>
          ) : (
            <BoardView/>
          )}
      </main>
    </>
  );
}
