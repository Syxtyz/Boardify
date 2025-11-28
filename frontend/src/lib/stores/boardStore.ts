import { create } from "zustand"
import { queryClient } from "../queryClient"
import { fetchBoardById } from "../api/boardAPI"
import type { Board } from "../objects/data"
import { persist } from "zustand/middleware"

interface BoardState {
    boards: Board[]
    selectedBoard: any | null
    selectBoard: (id: number) => Promise<void>
    clearSelectedBoard: () => void
}

export const BoardStore = create<BoardState>()(
    persist(
        (set) => ({
            boards: [],
            selectedBoard: null,

            selectBoard: async (id) => {
                const res = await fetchBoardById(id)
                queryClient.setQueryData(["board", id], res)
                set({ selectedBoard: res })
            },

            clearSelectedBoard: () => { set({ selectedBoard: null }), localStorage.removeItem("board")}
        }),
        {
            name: "board",
            partialize: (state) => ({
                selectedBoard: state.selectedBoard
            })
        }
    )
)