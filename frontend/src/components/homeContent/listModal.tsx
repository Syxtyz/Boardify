import { useState, useEffect } from "react";
import { ListStore } from "@/lib/stores/listStore";
import { CardStore } from "@/lib/stores/cardStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import CreateCard from "./createCard";

interface ListModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ListModal({ isOpen, onClose }: ListModalProps) {
  const { selectedList, clearSelectedList } = ListStore();
  const { fetchCardById } = CardStore();
  const { createCard, clearSelectedCard, selectedCard, creatingCard, setCreatingCard } = CardStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isOpen) {
      clearSelectedList();
      clearSelectedCard();
      setCreatingCard(false);
      setTitle("");
      setDescription("");
    }
  }, [isOpen, clearSelectedList]);

  if (!selectedList) return null;

  const handleCreateCard = async () => {
    if (!title.trim()) return;
    await createCard(selectedList.board_id, selectedList.id, title, description);
    setTitle("");
    setDescription("");
    setCreatingCard(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex">
        {/* LEFT SIDE — Cards */}
        <div className="flex-1 pr-4 border-r border-zinc-300 dark:border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {selectedList.title}
            </DialogTitle>
            <DialogDescription>
              View and manage the cards under this list.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Cards</h3>

            <ScrollArea className="h-[55vh] rounded-md pr-2">
              <div className="space-y-2">
                {selectedList.cards && selectedList.cards.length > 0 ? (
                  selectedList.cards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => {
                        fetchCardById(selectedList.board_id, selectedList.id, card.id);
                        setCreatingCard(false);
                      }}
                      className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                      <h4 className="font-medium break-all">{card.title}</h4>
                      {card.description && (
                        <p className="text-sm text-muted-foreground mt-1 truncate w-42">
                          {card.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No cards in this list yet.
                  </p>
                )}

                {/* ADD CARD COMPONENT */}
                <CreateCard
                  onClick={() => {
                    setCreatingCard(true);
                    clearSelectedCard();
                  }}
                />
              </div>

              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        </div>

        {/* RIGHT SIDE — Card Details or Create Form */}
        <div className="w-[45%] pl-4">
          {creatingCard ? (
            <>
              <h3 className="font-semibold text-lg mb-3">Create New Card</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Card title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={() => setCreatingCard(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCard}>Create</Button>
                </div>
              </div>
            </>
          ) : selectedCard ? (
            <>
              <h3 className="font-semibold text-lg mb-3">Card Details</h3>
              <div>
                <p className="font-medium text-base truncate">{selectedCard.title}</p>
                {selectedCard.description && (
                  <p className="text-sm text-muted-foreground mt-2 h-50 text-pretty flex">
                    {selectedCard.description}
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground mt-4">
              Select a card to view its details or create a new one.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
