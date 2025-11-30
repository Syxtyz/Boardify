import { api } from "@/lib/contexts/authContext"
import { create } from "zustand"
import { type Card } from "../objects/data"

interface CardProps {
    cards: Card[]
    loading: boolean
    error: string | null
    selectedCard: Card | null
    fetchCards: (boardId: number, listId: number) => Promise<void>
    fetchCardById: (boardId: number, listId: number, cardId: number) => Promise<void>
    clearSelectedCard: () => void
    creatingCard: boolean;
    setCreatingCard: (value: boolean) => void
}

export const CardStore = create<CardProps>((set, get) => ({
    cards: [],
    loading: false,
    selectedCard: null,
    error: null,
    creatingCard: false,
    
    fetchCards: async (boardId, listId) => {
        set({ error: null, loading: true })
        try {
            const res = await api.get(`/boards/${boardId}/lists/${listId}/cards/`)
            set({ cards: res.data, loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    fetchCardById: async (boardId, listId, cardId) => {
        set({ error: null, loading: true })
        try {
            const res = await api.get(`/boards/${boardId}/lists/${listId}/cards/${cardId}/`)
            set({ selectedCard: res.data, loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    clearSelectedCard: () => set({ selectedCard: null }),

    setCreatingCard: (value) => set({ creatingCard: value })
}));