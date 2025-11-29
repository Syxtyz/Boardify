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
    createCard: (boardId: number, listId: number, title: string, card_type: "paragraph" | "checkbox", description?: string, checkbox_items?: { text: string, checked: boolean }[]) => Promise<void>
    updateCard: (boardId: number, listId: number, cardId: number, data: Partial<Card>) => Promise<void>
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

    createCard: async (boardId, listId, title, card_type: "paragraph" | "checkbox", description = "", checkbox_items = []) => {
        set({ error: null, loading: true })
        try {
            const res = await api.post(`/boards/${boardId}/lists/${listId}/cards/`, { title, card_type, description, checkbox_items })
            set({ cards: [...get().cards, res.data], loading: false})
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    updateCard: async (boardId, listId, cardId, data) => {
        set({ error: null, loading: true })
        try {
            const res = await api.patch(`/boards/${boardId}/lists/${listId}/cards/${cardId}/`, data)
            const updatedCard = get().cards.map(card => card.id === cardId ? res.data : card)
            set({ cards: updatedCard, loading: false })
        } catch (e:any) {
            set({ error: e.message, loading: false })
        }
    },

    clearSelectedCard: () => set({ selectedCard: null }),

    setCreatingCard: (value) => set({ creatingCard: value })
}));