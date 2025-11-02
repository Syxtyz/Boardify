export interface Board {
    id: number;
    owner_id: number;
    title: string;
    created_at: number;
    is_public: boolean;
    public_id: number;
    public_url?: string;
    lists: List[];
}

export interface List {
    id: number;
    board_id: number;
    title: string;
    created_at: number;
    cards: Card[];
}

export interface Card {
    id: number;
    list_id: number;
    title: string;
    description: string;
    created_at: number;
}