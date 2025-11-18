import { Button } from "@/components/ui/button";
import { BoardStore } from "@/lib/stores/boardStore";
import { CardStore } from "@/lib/stores/cardStore";
import CardCheckboxList from "../chkBox";

interface CardDetailsProps {
    onEdit: () => void;
}

export default function CardDetails({ onEdit }: CardDetailsProps) {
    const { selectedCard, updateCard } = CardStore();
    const { selectedBoard } = BoardStore();
    if (!selectedCard) return null;

    if (!selectedBoard) return

    const toggleCheckbox = (i: number) => {
        const updated = selectedCard.checkbox_items.map((item, idx) =>
            idx === i ? { ...item, checked: !item.checked } : item
        );
        updateCard(selectedBoard?.id, selectedCard.list_id, selectedCard.id, {
            checkbox_items: updated,
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

            <div className="flex justify-end mt-4">
                <Button size="sm" variant="outline" onClick={onEdit}>
                    Edit
                </Button>
            </div>
        </div>
    );
}