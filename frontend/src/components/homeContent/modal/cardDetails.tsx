import { Button } from "@/components/ui/button";
import { BoardStore } from "@/lib/stores/boardStore";
import { CardStore } from "@/lib/stores/cardStore";
import CardCheckboxList from "./chkBox";
import { useCardDeleteMutation, useCardUpdateMutation } from "@/lib/hooks/useCard";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useComments, useCreateComment } from "@/lib/hooks/useComment";

interface CardDetailsProps {
    onEdit: () => void;
}

export default function CardDetails({ onEdit }: CardDetailsProps) {
    const { selectedCard } = CardStore();
    const { selectedBoard } = BoardStore();
    const deleteMutation = useCardDeleteMutation()
    const updateMutation = useCardUpdateMutation()
    const [newComment, setNewComment] = useState("")

    if (!selectedBoard) return
    if (!selectedCard) return null;

    const { data: comments = [], isLoading } = useComments(selectedCard?.id)
    const createCommentMutation = useCreateComment()

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
        <div className="flex flex-col pt-4 pr-4 gap-4">
            <div className="h-fit flex flex-col">
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

            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 border p-2 rounded"
                    />
                    <Button
                        size="sm"
                        onClick={() => {
                            if (newComment.trim()) {
                                createCommentMutation.mutate({
                                    cardId: selectedCard.id,
                                    content: newComment.trim(),
                                });
                                setNewComment("");
                            }
                        }}
                    >
                        Add
                    </Button>
                </div>

                <div className="mt-2 flex flex-col gap-1 overflow-auto max-h-32">
                    {isLoading ? (
                        <p>Loading comments...</p>
                    ) : comments.length === 0 ? (
                        <p>No comments yet.</p>
                    ) : (
                        comments.map((c) => (
                            <div key={c.id} className="text-sm border-b py-1">
                                <strong>{c.user || c.guest_name || "Guest"}:</strong> {c.content}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}