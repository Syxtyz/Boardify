import { create } from "zustand"
import { queryClient } from "../queryClient"
import { fetchBoardById } from "../api/boardAPI"
import type { Board } from "../objects/data"

interface BoardState {
    boards: Board[]
    selectedBoard: any | null
    selectBoard: (id: number) => Promise<void>
    clearSelectedBoard: () => void
}

export const BoardStore = create<BoardState>((set) => ({
    boards: [],
    selectedBoard: null,

    selectBoard: async (id) => {
        const cached = queryClient.getQueryData<Board>(["board", id])

        if (cached) {
            set({ selectedBoard: cached })
            return
        }

        const res = await fetchBoardById(id)
        queryClient.setQueryData(["board", id], res)
        set({ selectedBoard: res })
    },

    clearSelectedBoard: () => set({ selectedBoard: null })
}))