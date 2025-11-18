import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ListStore } from "@/lib/stores/listStore";
import { CardStore } from "@/lib/stores/cardStore";
import CardList from "./cardList";
import CardForm from "./cardForm";
import CardDetails from "./cardDetails";

interface ListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ListModal({ isOpen, onClose }: ListModalProps) {
    const { selectedList, clearSelectedList } = ListStore();
    const { selectedCard, creatingCard, setCreatingCard, clearSelectedCard } = CardStore();
    const [isEditing, setIsEditing] = useState(false);

    // Reset when closing or opening
    useEffect(() => {
        if (!isOpen) {
            clearSelectedList();
            clearSelectedCard();
            setCreatingCard(false);
            setIsEditing(false);
        } else {
            // clearSelectedCard();
            setCreatingCard(false);
            setIsEditing(false);
        }
    }, [isOpen]);

    if (!selectedList) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[80vh] flex overflow-hidden">
                <CardList
                    selectedList={selectedList}
                    setCreatingCard={setCreatingCard}
                    setIsEditing={setIsEditing}
                />
                <div className="w-[45%] pl-4">
                    {creatingCard ? (
                        <CardForm
                            selectedList={selectedList}
                            onCancel={() => setCreatingCard(false)}
                        />
                    ) : selectedCard ? (
                        isEditing ? (
                            <CardForm
                                selectedList={selectedList}
                                isEditing
                                onCancel={() => setIsEditing(false)}
                            />
                        ) : (
                            <CardDetails onEdit={() => setIsEditing(true)} />
                        )
                    ) : (
                        <p className="text-sm text-muted-foreground mt-4">
                            Select a card to view or create a new one.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
