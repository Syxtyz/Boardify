import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import CreateCard from "./createCard";
import { CardStore } from "@/lib/stores/cardStore";
import type { List } from "@/lib/objects/data";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";

interface CardListProps {
    selectedList: List | null
    setCreatingCard: (value: boolean) => void
    setIsEditing: (value: boolean) => void
    onSelect?: () => void
}

export default function CardList({ selectedList, setCreatingCard, setIsEditing, onSelect }: CardListProps) {
    const { fetchCardById, clearSelectedCard, selectedCard } = CardStore();

    if (!selectedList) return

    return (
        <div className="flex-1 w-full pt-4">
            <DialogHeader>
                <DialogTitle>{selectedList.title}</DialogTitle>
                <DialogDescription>View and manage the cards in this list.</DialogDescription>
            </DialogHeader>

            <ScrollArea className="mt-4 rounded-md">
                <div className="space-y-2">
                    {selectedList.cards?.length ? (
                        selectedList.cards.map((card) => {
                            const finished = card.card_type === "checkbox"
                                ? card.checkbox_items?.filter((item: any) => item.checked).length || 0
                                : 0;
                            const total = card.card_type === "checkbox"
                                ? card.checkbox_items?.length || 0
                                : 0;
                            return (
                                <div
                                    key={card.id}
                                    onClick={async () => {
                                        await fetchCardById(selectedList.board_id, selectedList.id, card.id);
                                        setCreatingCard(false);
                                        setIsEditing(false);
                                        onSelect?.()
                                    }}
                                    className={`flex flex-col p-3 bg-zinc-100 dark:bg-zinc-800 hover:border-zinc-400 cursor-pointer ${selectedCard?.id === card.id && "border-zinc-400 dark:border-zinc-600"}`}
                                >
                                    <h4 className="font-medium wrap-break-word">{card.title}</h4>
                                    {card.card_type === "paragraph" ? (
                                        <p className="text-sm text-muted-foreground w-80 truncate">{card.description}</p>
                                    ) : (
                                        <div>
                                            <CheckBoxOutlinedIcon fontSize="small" />
                                            {finished} / {total}
                                        </div>
                                    )}
                                </div>
                            )
                        })
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
                            onSelect?.()
                        }}
                    />

                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>

        </div>
    );
}