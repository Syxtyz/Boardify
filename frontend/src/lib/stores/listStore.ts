import { api } from "@/lib/contexts/authContext"
import { create } from "zustand"
import { type List } from "../objects/data"

interface ListProps {
    lists: List[]
    loading: boolean
    error: string | null
    selectedList: List | null
    fetchLists: (boardId: number) => Promise<void>
    fetchListById: (boardId: number, listId: number) => Promise<void>
    updateList: (boardId: number, listId: number, title: string) => Promise<void>
    deleteList: (boardId: number, listId: number) => Promise<void>
    clearSelectedList: () => void;
}

export const ListStore = create<ListProps>((set, get) => ({
    lists: [],
    loading: false,
    selectedList: null,
    error: null,

    fetchLists: async (boardId) => {
        set({ error: null, loading: true })
        try {
            const res = await api.get(`/boards/${boardId}/lists/`)
            set({ lists: res.data, loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    fetchListById: async (boardId, listId) => {
        set({ error: null, loading: true })
        try {
            const res = await api.get(`/boards/${boardId}/lists/${listId}/`)
            set({ selectedList: res.data, loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    updateList: async (boardId, listId, title) => {
        set({ error: null, loading: true })
        try {
            const res = await api.patch(`/boards/${boardId}/lists/${listId}/`, { title })
            const updatedList = get().lists.map(list =>
                list.id === listId ? res.data : list
            )
            set({ lists: updatedList, loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    deleteList: async (boardId, listId) => {
        set({ error: null, loading: true })
        try {
            await api.delete(`/boards/${boardId}/lists/${listId}/`)
            set({ lists: get().lists.filter(list => list.id !== listId), loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    clearSelectedList: () => set({ selectedList: null })
}));