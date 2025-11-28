import { api } from "@/lib/contexts/authContext"
import { create } from "zustand"
import { type List } from "../objects/data"

interface ListProps {
    lists: List[]
    loading: boolean
    error: string | null
    selectedList: List | null
    fetchListById: (boardId: number, listId: number) => Promise<void>
    clearSelectedList: () => void;
}

export const ListStore = create<ListProps>((set, get) => ({
    lists: [],
    loading: false,
    selectedList: null,
    error: null,

    fetchListById: async (boardId, listId) => {
        set({ error: null, loading: true })
        try {
            const res = await api.get(`/boards/${boardId}/lists/${listId}/`)
            set({ selectedList: res.data, loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    clearSelectedList: () => set({ selectedList: null })
}));