import { Button } from "@/components/ui/button";
import { BoardStore } from "@/lib/stores/boardStore";
import { CardStore } from "@/lib/stores/cardStore";
import CardCheckboxList from "./chkBox";
import { useCardDeleteMutation, useCardUpdateMutation } from "@/lib/hooks/useCard";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useComments, useCreateComment } from "@/lib/hooks/useComment";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

interface CardDetailsProps {
    onEdit: () => void;
}

const COMMENTS_PER_PAGE = 5;

export default function CardDetails({ onEdit }: CardDetailsProps) {
    const { selectedCard } = CardStore();
    const { selectedBoard } = BoardStore();
    const deleteMutation = useCardDeleteMutation();
    const updateMutation = useCardUpdateMutation();
    const [newComment, setNewComment] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    if (!selectedBoard || !selectedCard) return null;

    const { data: comments = [], isLoading } = useComments(selectedCard.id);
    const createCommentMutation = useCreateComment();

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

    const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
    const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
    const paginatedComments = comments.slice(startIndex, startIndex + COMMENTS_PER_PAGE);

    function getPaginationPages(currentPage: number, totalPages: number) {
        const pages: (number | "ellipsis")[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1)

            if (currentPage > 3) pages.push("ellipsis")

            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)

            for (let i = start; i <= end; i++) pages.push(i)

            if (currentPage < totalPages - 2) pages.push("ellipsis")

            pages.push(totalPages)
        }

        return pages;
    }

    const handleAddComment = () => {
        if (newComment.trim()) {
            createCommentMutation.mutate({
                cardId: selectedCard.id,
                content: newComment.trim(),
            });
            setNewComment("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddComment();
        }
        if (e.key === "Escape") {
            e.preventDefault();
            setNewComment("");
        }
    };

    return (
        <div className="flex flex-col pt-4 gap-4">
            <div className="h-fit flex flex-col">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-center self-center">{selectedCard.title}</h3>
                    <div className="flex gap-2">
                        <Button
                            className="w-16"
                            size="default"
                            variant="outline"
                            onClick={() =>
                                deleteMutation.mutate({
                                    boardId: selectedBoard.id,
                                    listId: selectedCard.list_id,
                                    cardId: selectedCard.id,
                                })
                            }
                        >
                            Delete
                        </Button>
                        <Button className="w-16" size="default" variant="outline" onClick={onEdit}>
                            Edit
                        </Button>
                    </div>
                </div>

                {selectedCard.card_type === "paragraph" ? (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap wrap-break-word overflow-auto">
                        {selectedCard.description}
                    </p>
                ) : (
                    <CardCheckboxList items={selectedCard.checkbox_items} onToggle={toggleCheckbox} />
                )}
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
                <div className="flex gap-2 h-10">
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 border p-2 rounded"
                        onKeyDown={handleKeyDown}
                    />

                    <Button
                        className="h-full"
                        onClick={handleAddComment}
                    >
                        Add
                    </Button>
                </div>

                <div className="flex flex-col gap-1 overflow-auto h-63.6">
                    {isLoading ? (
                        <p>Loading comments...</p>
                    ) : comments.length === 0 ? (
                        <p>No comments yet.</p>
                    ) : (
                        paginatedComments.map((c) => (
                            <div key={c.id} className="py-1 items-center">
                                <div className="flex flex-row gap-2">
                                    <strong>{c.user || c.guest_name || "Guest"}:</strong>
                                    <p>{c.content}</p>
                                </div>
                                <p className="text-muted-foreground text-xs">({new Date(c.created_at).toLocaleString()})</p>
                            </div>
                        ))
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                                    }}
                                    isActive={currentPage > 1}
                                />
                            </PaginationItem>

                            {getPaginationPages(currentPage, totalPages).map((p, idx) => (
                                <PaginationItem key={idx}>
                                    {p === "ellipsis" ? (
                                        <span className="px-2">…</span>
                                    ) : (
                                        <PaginationLink
                                            isActive={currentPage === p}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(p as number);
                                            }}
                                        >
                                            {p}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                    }}
                                    isActive={currentPage < totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </div>
    );
}
