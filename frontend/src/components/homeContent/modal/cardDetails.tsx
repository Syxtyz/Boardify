import { Button } from "@/components/ui/button";
import { BoardStore } from "@/lib/stores/boardStore";
import { CardStore } from "@/lib/stores/cardStore";
import CardCheckboxList from "./chkBox";
import { useCardDeleteMutation, useCardUpdateMutation } from "@/lib/hooks/useCard";
import { Separator } from "@/components/ui/separator";

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
        <div className="flex flex-col gap-4">
            <div className="h-fit flex flex-col p-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lgtext-center self-center">{selectedCard.title}</h3>
                    <div>
                        <Button className="w-16" size={"default"} variant={"outline"} onClick={() => deleteMutation.mutate({ boardId: selectedBoard.id, listId: selectedCard.list_id, cardId: selectedCard.id })}>Delete</Button>
                        <Button className="w-16" size="default" variant="outline" onClick={onEdit}>Edit</Button>
                    </div>

                </div>
                {selectedCard.card_type === "paragraph" ? (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap wrap-break-word overflow-auto">{selectedCard.description}</p>
                ) : (
                    <CardCheckboxList items={selectedCard.checkbox_items} onToggle={toggleCheckbox} />
                )}
            </div>

            <Separator />

            <div className="border-4 p-4 flex h-40 items-center">
                <p>Comment Box</p>
            </div>
        </div>
    );
}