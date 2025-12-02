import { Checkbox } from "@/components/ui/checkbox"
import type { CheckBoxItem } from "@/lib/objects/data"

interface CardCheckboxListProps {
    items: CheckBoxItem[]
    onToggle?: (index: number) => void
    readOnly?: boolean
}

export default function CardCheckboxList({ items, onToggle, readOnly = false }: CardCheckboxListProps) {
    return (
        <div>
            {items.map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                    <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => !readOnly && onToggle?.(i)}
                        disabled={readOnly}
                    />
                    <span
                        className={`text-sm ${item.checked ? "line-through text-muted-foreground" : ""
                            }`}
                    >
                        {item.text}
                    </span>
                </div>
            ))}
        </div>
    )
}