import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import type { ReactNode } from "react";
import type { List, Card } from "../../types/interfaces/data";

interface ListModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  cards?: Card[];
  defaultCard?: Card | null;
  list?: List | null;
}

export default function ListModal({ isOpen, onClose, cards = [], defaultCard = null, list = null }: ListModalProps) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(defaultCard);

  useEffect(() => {
    if (!isOpen) {
      setSelectedCard(null);
    } else {
      setSelectedCard(defaultCard);
    }
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50
      ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={onClose}
    >

      <div className="relative flex bg-zinc-100 dark:bg-zinc-900 rounded-lg shadow-lg w-[800px] h-[500px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="w-1/2 p-4 border-r border-gray-300 dark:border-zinc-700 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">{list?.title}</h2>
          <div className="flex flex-col gap-2">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`p-3 rounded cursor-pointer transition ${
                  selectedCard?.id === card.id
                    ? "bg-zinc-200 dark:bg-zinc-700"
                    : "bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
                onClick={() => setSelectedCard(card)}
              >
                <p className="font-medium">{card.title}</p>
                <p className="text-sm text-gray-500">{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/2 p-4 overflow-y-auto">
          {selectedCard ? (
            <>
              <h3 className="text-xl font-semibold mb-2">{selectedCard.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {selectedCard.description || "No description provided."}
              </p>
              {/* <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Edit Card
              </button> */}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a card to view details
            </div>
          )}
        </div>
        
        <CloseIcon
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-4xl"
        />

      </div>
    </div>
  );
}
