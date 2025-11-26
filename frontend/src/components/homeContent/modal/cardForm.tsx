import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { CardStore } from "@/lib/stores/cardStore";
import type { List, CheckBoxItem } from "@/lib/objects/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CardFormProps {
    selectedList: List | null;
    isEditing?: boolean;
    onCancel: () => void;
}

export default function CardForm({ selectedList, isEditing = false, onCancel }: CardFormProps) {
    const { selectedCard, createCard, updateCard } = CardStore();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [cardType, setCardType] = useState<"paragraph" | "checkbox" | undefined>(undefined);
    const [checkboxItems, setCheckboxItems] = useState<CheckBoxItem[]>([]);

    if (!selectedList) return

    useEffect(() => {
        if (isEditing && selectedCard) {
            setTitle(selectedCard.title);
            setDescription(selectedCard.description || "");
            setCardType(selectedCard.card_type || undefined);
            setCheckboxItems(selectedCard.checkbox_items || []);
        }
    }, [isEditing, selectedCard]);

    const isCheckbox = cardType === "checkbox";
    const allFilled = !isCheckbox || checkboxItems.every((i) => i.text.trim());

    const queryClient = useQueryClient();

    // Mutation for creating a card
    const createCardMutation = useMutation({
        mutationFn: async () => {
            return await createCard(
                selectedList.board_id,
                selectedList.id,
                title,
                cardType!,
                description,
                checkboxItems
            );
        },
        onSuccess: () => {
            toast.success("Card created successfully!");
            // Optionally refetch lists or cards to update UI
            queryClient.invalidateQueries({ queryKey: ["lists", selectedList.board_id] });
            onCancel();
        },
        onError: () => toast.error("Failed to create card."),
    });

    // Mutation for updating a card
    const updateCardMutation = useMutation({
        mutationFn: async () => {
            if (!selectedCard) throw new Error("No card selected");
            const data = {
                title,
                description,
                card_type: cardType,
                checkbox_items: checkboxItems,
            };
            return await updateCard(
                selectedList.board_id,
                selectedList.id,
                selectedCard.id,
                data
            );
        },
        onSuccess: () => {
            toast.success("Card updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["lists", selectedList.board_id] });
            onCancel();
        },
        onError: () => toast.error("Failed to update card."),
    });

    const handleSave = async () => {
        if (!title.trim()) return toast.warning("Please enter a title.");
        if (!cardType) return toast.warning("Please select a card type.");

        if (isEditing) {
            updateCardMutation.mutate();
        } else {
            createCardMutation.mutate();
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-lg">{isEditing ? "Edit Card" : "Create New Card"}</h3>

            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

            <Select
                value={cardType}
                onValueChange={(choice) => {
                    const type = choice as "paragraph" | "checkbox"
                    setCardType(type)

                    if (type === "checkbox") {
                        setDescription("")
                        if (checkboxItems.length === 0) {
                            setCheckboxItems([{ text: "", checked: false }])
                        }
                    } else if (type === "paragraph") {
                        setCheckboxItems([])
                    }
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                </SelectContent>
            </Select>

            <ScrollArea className="h-62 pr-4">
                {cardType === "checkbox" ? (
                    <div className="space-y-2">
                        {checkboxItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Checkbox
                                    checked={item.checked}
                                    onCheckedChange={() => {
                                        const updated = [...checkboxItems];
                                        updated[i].checked = !updated[i].checked;
                                        setCheckboxItems(updated);
                                    }}
                                />
                                <Input
                                    value={item.text}
                                    onChange={(e) => {
                                        const updated = [...checkboxItems];
                                        updated[i].text = e.target.value;
                                        setCheckboxItems(updated);
                                    }}
                                    placeholder="Item text"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setCheckboxItems(checkboxItems.filter((_, idx) => idx !== i))}
                                >
                                    <XIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="ghost"
                            onClick={() => setCheckboxItems([...checkboxItems, { text: "", checked: false }])}
                            disabled={checkboxItems.length > 0 && !checkboxItems[checkboxItems.length - 1].text.trim()}
                        >
                            Add item
                        </Button>
                    </div>
                ) : cardType === "paragraph" ? (
                    <Textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                ) : null}
            </ScrollArea>
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button
                    onClick={handleSave}
                    disabled={
                        !allFilled ||
                        createCardMutation.isPending ||
                        updateCardMutation.isPending
                    }
                >
                    {createCardMutation.isPending || updateCardMutation.isPending
                        ? "Saving..."
                        : isEditing
                            ? "Save"
                            : "Create"}
                </Button>
            </div>
        </div>
    );
}
