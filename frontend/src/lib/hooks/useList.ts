import { useMutation } from "@tanstack/react-query"
import { createList, deleteList, reorderLists, updateList } from "../api/listAPI"
import { BoardStore } from "../stores/boardStore"
import { queryClient } from "../queryClient"
import { toast } from "sonner"
import type { List } from "../objects/data"

export const useListUpdateMutation = () => {
  const updateMutation = useMutation({
    mutationFn: ({ boardId, listId, title }: { boardId: number, listId: number, title: string }) => updateList(boardId, listId, title),
    onSuccess: (data) => {
      BoardStore.setState((state) => {
        const newList = state.selectedBoard.lists.map((list: List) => list.id === data.id ? { ...list, ...data } : list)
        return { selectedBoard: { ...state.selectedBoard, lists: newList }}
      })
      queryClient.invalidateQueries({ queryKey: ["boards"] })
      toast.success("Title renamed successfully!")
    },

    onError: () => toast.error("Failed to change the title")
  })

  return updateMutation
}

export const useListCreateMutation = () => {
  const createMutation = useMutation({
    mutationFn: ({ id, title }: { id: number, title: string }) => createList(id, title),
    onSuccess: (data) => {
      BoardStore.setState({ selectedBoard: data })
      queryClient.invalidateQueries({ queryKey: ["boards"] })
    }
  })
  return createMutation
}

export const useReorderListMutation = (boardId: number) => {
  return useMutation({
    mutationFn: (lists: { id: number, order: number }[]) => reorderLists(lists),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] })
    },
    onError: () => {
      toast.error("Failed to reorder lists")
    },
  });
};

export const useListDeleteMutation = () => {
  return useMutation({
    mutationFn: ({ boardId, listId }: { boardId: number, listId: number}) => deleteList(boardId, listId),
    onSuccess: (_, variables) => {
      const { listId } = variables // get listId from variables

      // Update the local BoardStore
      BoardStore.setState((state) => {
        if (!state.selectedBoard) return {}
        return {
          selectedBoard: {
            ...state.selectedBoard,
            lists: state.selectedBoard.lists.filter((l: List) => l.id !== listId)
          }
        }
      })

      queryClient.invalidateQueries({ queryKey: ["boards"] })
      toast.success("List deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete")
    }
  })
}