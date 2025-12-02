import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import { toast } from "sonner"
import { CardStore } from "@/lib/stores/cardStore"
import type { List, CheckBoxItem } from "@/lib/objects/data"
import { useCardCreateMutation, useCardUpdateMutation } from "@/lib/hooks/useCard"

interface CardFormProps {
    selectedList: List | null
    isEditing?: boolean
    onCancel: () => void
}

export default function CardForm({ selectedList, isEditing = false, onCancel }: CardFormProps) {
    const { selectedCard } = CardStore()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [cardType, setCardType] = useState<"paragraph" | "checkbox" | undefined>(undefined)
    const [checkboxItems, setCheckboxItems] = useState<CheckBoxItem[]>([])

    const createCardMutation = useCardCreateMutation()
    const updateCardMutation = useCardUpdateMutation()

    if (!selectedList) return null

    useEffect(() => {
        if (isEditing && selectedCard) {
            setTitle(selectedCard.title)
            setDescription(selectedCard.description || "")
            setCardType(selectedCard.card_type)
            setCheckboxItems(selectedCard.checkbox_items || [])
        }
    }, [isEditing, selectedCard]);

    const handleSave = () => {
        if (!title.trim()) return toast.warning("Please enter a title.")
        if (!cardType) return toast.warning("Please select a card type.")

        const newData = {
            title,
            description: description || "",
            card_type: cardType,
            checkbox_items: checkboxItems
        };

        if (isEditing && selectedCard) {
            updateCardMutation.mutate({
                boardId: selectedList.board_id,
                listId: selectedList.id,
                cardId: selectedCard.id,
                newData
            });
        } else {
            createCardMutation.mutate({
                boardId: selectedList.board_id,
                listId: selectedList.id,
                title,
                card_type: cardType,
                description: description || "",
                checkbox_items: checkboxItems.map((i) => ({ text: i.text, checked: i.checked }))
            });
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-lg">{isEditing ? "Edit Card" : "Create New Card"}</h3>

            <div className="flex items-center space-x-2">

                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

                <Select
                    value={cardType}
                    onValueChange={(choice) => {
                        const type = choice as "paragraph" | "checkbox";
                        setCardType(type);

                        if (type === "checkbox") {
                            setDescription("");
                            if (checkboxItems.length === 0) {
                                setCheckboxItems([{ text: "", checked: false }]);
                            }
                        } else {
                            setCheckboxItems([]);
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
            </div>

            <div>
                {cardType === "checkbox" ? (
                    <div className="space-y-2">
                        <p>Items:</p>
                        {checkboxItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
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
                                    onClick={() =>
                                        setCheckboxItems(checkboxItems.filter((_, idx) => idx !== i))
                                    }
                                >
                                    <XIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <div className="flex justify-between mr-11">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setCheckboxItems([...checkboxItems, { text: "", checked: false }])
                                }
                                disabled={
                                    checkboxItems.length > 0 &&
                                    !checkboxItems[checkboxItems.length - 1].text.trim()
                                }
                            >
                                Add item
                            </Button>
                            <div className="flex flex-row sm:justify-end gap-4 sm:space-y-0 sm:pt-0">
                                <Button
                                    className="rounded"
                                    onClick={handleSave}
                                    disabled={
                                        createCardMutation.isPending || updateCardMutation.isPending
                                    }
                                >
                                    {createCardMutation.isPending || updateCardMutation.isPending
                                        ? "Saving..."
                                        : "Save"}
                                </Button>
                                <Button className="rounded" variant="secondary" onClick={onCancel}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : cardType === "paragraph" ? (
                    <Textarea
                        className="w-full"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                ) : null}
            </div>

            {cardType === "paragraph" && (
                <div className="flex flex-row sm:justify-end gap-2 sm:space-y-0 sm:pt-0">
                    <Button
                        className="rounded"
                        onClick={handleSave}
                        disabled={
                            createCardMutation.isPending || updateCardMutation.isPending
                        }
                    >
                        {createCardMutation.isPending || updateCardMutation.isPending
                            ? "Saving..."
                            : "Save"}
                    </Button>
                    <Button className="rounded" variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    );
}