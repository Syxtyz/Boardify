import type { Card } from "../../types/interfaces/data";

interface CardViewProps {
  card: Card;
}

export default function CardView({ card }: CardViewProps) {
  return (
    <div className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded cursor-pointer shadow hover:shadow-md transition-shadow hover:bg-zinc-300">

      <p className="font-medium">{card.title}</p>

      {card.description && (
        <p className="text-sm text-gray-500">{card.description}</p>
      )}
      
    </div>
  );
}
