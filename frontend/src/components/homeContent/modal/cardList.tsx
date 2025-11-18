import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import CreateCard from "../createCard";
import { CardStore } from "@/lib/stores/cardStore";
import type { List } from "@/lib/objects/data";
import type { Dispatch, SetStateAction } from "react";

interface CardListProps {
    selectedList: List
    setCreatingCard: (value: boolean) => void
    setIsEditing: Dispatch<SetStateAction<boolean>>
}

export default function CardList({ selectedList, setCreatingCard, setIsEditing }: CardListProps) {
    const { fetchCardById, clearSelectedCard, selectedCard } = CardStore();

    return (
        <div className="flex-1 pr-4 border-r border-zinc-300 dark:border-zinc-700">
            <DialogHeader>
                <DialogTitle>{selectedList.title}</DialogTitle>
                <DialogDescription>View and manage the cards in this list.</DialogDescription>
            </DialogHeader>

            <ScrollArea className="mt-4 h-[55vh] rounded-md pr-2">
                <div className="space-y-2">
                    {selectedList.cards?.length ? (
                        selectedList.cards.map((card) => (
                            <div
                                key={card.id}
                                onClick={() => {
                                    fetchCardById(selectedList.board_id, selectedList.id, card.id);
                                    setCreatingCard(false);
                                    setIsEditing(false);
                                }}
                                className={`p-3 rounded-lg bg-zinc-100 w-52 dark:bg-zinc-800 hover:border-zinc-400 transition cursor-pointer ${selectedCard?.id === card.id ? "border-zinc-400 dark:border-zinc-600" : ""
                                    }`}
                            >
                                <h4 className="font-medium break-all">{card.title}</h4>
                                {card.description && (
                                    <p className="text-sm text-muted-foreground truncate">{card.description}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No cards in this list yet.
                        </p>
                    )}

                    <CreateCard
                        onClick={() => {
                            setCreatingCard(true);
                            clearSelectedCard();
                            setIsEditing(false);
                        }}
                    />
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </div>
    );
}