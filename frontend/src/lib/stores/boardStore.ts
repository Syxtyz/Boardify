import { api } from "@/contexts/authContext";
import { create } from "zustand";
import { type Board } from "../objects/data";

interface BoardProps {
    boards: Board[]
    selectedBoard: Board | null
    loading: boolean
    error: string | null
    fetchBoards: () => Promise<void>
    fetchBoardById: (boardId: number) => Promise<void>
    createBoard: (title: string) => Promise<Board>
    updateBoard: (boardId: number, newTitle: string) => Promise<void> 
    deleteBoard: (boardId: number) => Promise<void>
    shareBoard: (boardId: number) => Promise<string | undefined>
    fetchBoardByPublicId: (publicId: string) => Promise<void>
}

export const BoardStore = create<BoardProps>((set, get) => ({
    boards: [],
    loading: false,
    selectedBoard: null,
    error: null,

    fetchBoards: async () => {
        if (get().boards.length > 0) return;
        set({ error: null, loading: true})
        try {
            const res = await api.get("/boards/")
            set({ boards: res.data, loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    fetchBoardById: async (boardId) => {
        const cached = get().boards.find(b => b.id === boardId)
        if (cached) return set({ selectedBoard: cached });

        set({ error: null, loading: true })
        try {
            const res = await api.get(`/boards/${boardId}/`)
            set({ selectedBoard: res.data, loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false})
        }
    },
    
    createBoard: async (title) => {
        set({ error: null, loading: true })
        try {
            const res = await api.post(`/boards/`, { title })
            set({ boards: [...get().boards, res.data], loading: false })
            return res.data;
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    updateBoard: async (boardId, newTitle) => {
        set({ error: null, loading: true })
        try {
            const res = await api.patch(`/boards/${boardId}/`, { newTitle })
            const updatedBoard = get().boards.map(board => board.id === boardId ? res.data : board)
            set({ boards: updatedBoard, loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    deleteBoard: async (boardId) => {
        set({ error: null, loading: true })
        try {
            await api.delete(`/boards/${boardId}/`)
            set({ boards: get().boards.filter(board => board.id !== boardId), loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    shareBoard: async (boardId) => {
        set({ error: null, loading: true })
        try {
            const res = await api.post(`/boards/${boardId}/share/`)
            const link = res.data.link
            const updatedBoard = get().boards.map((b) => 
                b.id === boardId ? { ...b, public_url: link } : b
            )

            const currentBoard = get().selectedBoard
            
            set({ boards: updatedBoard, selectedBoard: currentBoard ? { ...currentBoard, public_url: link } : null, loading: false })
            return link
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    },

    fetchBoardByPublicId: async (publicId) => {
        set({ error: null, loading: true })
        try {
            const res = await api.get(`/boards/public/${publicId}/`)
            set({ selectedBoard: res.data, loading: false })
        } catch (e: any) {
            set({ error: e.message, loading: false })
        }
    }
}))