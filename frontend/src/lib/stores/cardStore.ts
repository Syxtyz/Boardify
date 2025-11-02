import { api } from "@/contexts/authContext"
import { create } from "zustand"
import { type Card } from "../objects/data"

interface CardProps {
    cards: Card[]
    loading: boolean
    error: string | null
    selectedCard: Card | null
    fetchCards: (boardId: number, listId: number) => Promise<void>
    fetchCardById: (boardId: number, listId: number, cardId: number) => Promise<void>
    createCard: (boardId: number, listId: number, title: string, description: string) => Promise<void>
    updateCardTitle: (boardId: number, listId: number, cardId: number, title: string) => Promise<void>
    updateCardDescription: (boardId: number, listId: number, cardId: number, description: string) => Promise<void>
    deleteCard: (boardId: number, listId: number, cardId: number) => Promise<void>
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

    createCard: async (boardId, listId, title, description) => {
        set({ error: null, loading: true })
        try {
            const res = await api.post(`/boards/${boardId}/lists/${listId}/cards/`, { title, description })
            set({ cards: [...get().cards, res.data], loading: false})
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    updateCardTitle: async (boardId, listId, cardId, title) => {
        set({ error: null, loading: true })
        try {
            const res = await api.patch(`/boards/${boardId}/lists/${listId}/cards/${cardId}/`, { title })
            const updatedCardTitle = get().cards.map(card =>
                card.id === cardId ? res.data : card
            )
            set({ cards: updatedCardTitle, loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    updateCardDescription: async (boardId, listId, cardId, description) => {
        set({ error: null, loading: true })
        try {
            const res = await api.patch(`/boards/${boardId}/lists/${listId}/cards/${cardId}/`, { description })
            const updatedCardDescription = get().cards.map(card =>
                card.id === cardId ? res.data : card
            )
            set({ cards: updatedCardDescription, loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    deleteCard: async (boardId, listId, cardId) => {
        set({ error: null, loading: true })
        try {
            await api.delete(`/boards/${boardId}/lists/${listId}/cards/${cardId}/`)
            set({ cards: get().cards.filter(card => card.id !== cardId), loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    clearSelectedCard: () => set({ selectedCard: null }),

    setCreatingCard: (value) => set({ creatingCard: value })
}));