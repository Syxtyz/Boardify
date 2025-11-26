import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBoard, deleteBoard, fetchBoardById, fetchBoardByPublicId, shareBoard, toggleBoardPublic, unshareBoard, updateBoard } from "../api/boardAPI";
import { BoardStore } from "../stores/boardStore";
import { queryClient } from "../queryClient";
import type { User } from "../objects/data";
import { createList } from "../api/listAPI";

export const useUpdateMutation = () => {
    const updateMutation = useMutation({
        mutationFn: ({ id, title }: { id: number, title: string }) => updateBoard(id, title),
        onSuccess: (data) => {
            BoardStore.setState({ selectedBoard: data })
            queryClient.invalidateQueries({ queryKey: ["boards"] })
            toast.success("Board renamed successfully!")
        },
        onError: () => toast.error("Failed to rename board"),
    })

    return updateMutation
}

export const useUnshareBoard = () => {
    return useMutation({
        mutationFn: ({ id, userId }: { id: number, userId: number }) =>
            unshareBoard(id, userId),
        onSuccess: (_, { id, userId }) => {
            const board = BoardStore.getState().selectedBoard
            if (board && board.id === id) {
                BoardStore.setState({ selectedBoard: { ...board, shared_users: board.shared_users.filter((u: User) => u.id !== userId) } })
            }
            queryClient.invalidateQueries({ queryKey: ["board", id] })
        }
    })
}

export const useShareBoard = () => {
    return useMutation({
        mutationFn: ({ id, email }: { id: number, email: string }) => shareBoard(id, email),
        onSuccess: (data, { id }) => {
            const board = BoardStore.getState().selectedBoard
            if (board && board.id === id) {
                BoardStore.setState({
                    selectedBoard: { ...board, shared_users: [...(board.shared_users || []), data.user] }
                })
            }
            queryClient.invalidateQueries({ queryKey: ["board", id] })
        }
    })
}

export const usePublicBoard = (publicId: string) => {
    return useQuery({
        queryKey: ["publicBoard", publicId],
        queryFn: () => fetchBoardByPublicId(publicId),
        enabled: !!publicId
    })
}

export const useDeleteMutation = () => {
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteBoard(id),
        onSuccess: () => {
            toast.success("Board deleted successfully")
            queryClient.invalidateQueries({ queryKey: ["boards"] })
            BoardStore.setState({ selectedBoard: null })
        },
        onError: () => toast.error("Failed to delete board"),
    })

    return deleteMutation
}

export const useBoardToggleMutations = () => {
    const toggleMutation = useMutation({
        mutationFn: (id: number) => toggleBoardPublic(id),
        onSuccess: (data) => {
            const board = data.board
            queryClient.setQueryData(["board", board.id], board)
        },
        onError: () => toast.error("Failed to share"),
    })

    return toggleMutation
}

interface CreateBoardProps {
    title: string
    lists: string[]
}

export const useCreateBoardMutation = () => {
    const createMutation = useMutation({
        mutationFn: async ({ title, lists }: CreateBoardProps) => {
            const newBoard = await createBoard(title.trim())
            if (!newBoard.id) throw new Error("Board created unsuccessfully")

            for (let i = 0; i < lists.length; i++) {
                await createList(newBoard.id, lists[i])
            }

            // await Promise.all(lists.map((list) => createList(newBoard.id, list)))
            const fullBoard = await fetchBoardById(newBoard.id)
            return fullBoard
        },
        onSuccess: (data) => {
            BoardStore.setState({ selectedBoard: data })
            queryClient.invalidateQueries({ queryKey: ["boards"] })
            toast.success("Board created successfully!")
        },
        onError: () => toast.error("Failed to create board")
    })
    return createMutation
}
