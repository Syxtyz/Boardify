export interface User {
    id: number
    username: string
    email: string
    date_joined: string
}

export interface Board {
    id: number
    owner: number
    title: string
    created_at: string
    is_public: boolean
    public_id: string
    public_url?: string
    lists: List[]
    shared_users?: User[]
}

export interface List {
    id: number
    board_id: number
    title: string
    created_at: number
    order: number
    cards: Card[]
}

export interface CheckBoxItem {
    text: string
    checked: boolean
}

export interface Card {
    id: number
    list_id: number
    title: string
    card_type: "paragraph" | "checkbox"
    description: string
    checkbox_items: CheckBoxItem[]
    created_at: string
    order: number
}
