import { Button } from "@/components/ui/button";
import { BoardStore } from "@/lib/stores/boardStore";
import { CardStore } from "@/lib/stores/cardStore";
import CardCheckboxList from "../chkBox";
import { useCardDeleteMutation, useCardUpdateMutation } from "@/lib/hooks/useCard";

interface CardDetailsProps {
    onEdit: () => void;
}

export default function CardDetails({ onEdit }: CardDetailsProps) {
    const { selectedCard } = CardStore();
    const { selectedBoard } = BoardStore();
    const deleteMutation = useCardDeleteMutation()
    const updateMutation = useCardUpdateMutation()
    if (!selectedCard) return null;

    if (!selectedBoard) return

    const toggleCheckbox = (i: number) => {
        const updated = selectedCard.checkbox_items.map((item, idx) =>
            idx === i ? { ...item, checked: !item.checked } : item
        );
        updateMutation.mutate({
            boardId: selectedBoard.id,
            listId: selectedCard.list_id,
            cardId: selectedCard.id,
            newData: { checkbox_items: updated },
        });
    };

    return (
        <div>
            <h3 className="font-semibold text-lg mb-2">{selectedCard.title}</h3>
            {selectedCard.card_type === "paragraph" ? (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedCard.description}
                </p>
            ) : (
                <CardCheckboxList items={selectedCard.checkbox_items} onToggle={toggleCheckbox} />
            )}

            <div className="flex justify-end mt-4 gap-2">
                <Button size={"sm"} variant={"outline"} onClick={() => deleteMutation.mutate({ boardId: selectedBoard.id, listId: selectedCard.list_id, cardId: selectedCard.id })}>Delete</Button>
                <Button size="sm" variant="outline" onClick={onEdit}>
                    Edit
                </Button>
            </div>
        </div>
    );
}