import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import type { Board, List, Card } from "../../types/interfaces/data";
import ListView from "./listView";
import ListModal from "./listModal";

export default function BoardView({ selectedBoard }: { selectedBoard: Board }) {
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const closeModal = () => {
    setSelectedList(null);    
    setSelectedCard(null);
  };

  return (
    <>
      <h1 className="ml-4 text-2xl self-center font-bold">{selectedBoard.title}</h1>

      <div className="flex items-start gap-4">
        {selectedBoard.lists.map((list) => (
          <ListView
            key={list.id}
            list={list}
            onListClick={() => {
              setSelectedList(list);
              setSelectedCard(null);
            }}
            onCardClick={(card) => {
              setSelectedList(list);
              setSelectedCard(card);
            }}
          />
        ))}

        <div className="bg-gray-100 dark:bg-zinc-800 h-9 rounded-lg flex">
          <button className="cursor-pointer group flex items-center rounded-lg shadow overflow-hidden transition-all w-9 hover:w-[250px]">
            <div className="w-9 flex justify-center items-center flex-shrink-0">
              <AddIcon/>
            </div>
            <span className="ml-2 text-sm font-medium opacity-0 transition-opacity duration-300 delay-50 group-hover:opacity-100 whitespace-nowrap">
              Add List
            </span>
          </button>
        </div>

      </div>

      <ListModal
        isOpen={!!selectedList}
        onClose={closeModal}
        cards={selectedList?.cards ?? []}
        defaultCard={selectedCard}
        list={selectedList}
      />
    </>
  );
}
