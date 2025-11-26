import { useMutation } from "@tanstack/react-query"
import { createList, reorderLists } from "../api/listAPI"
import { BoardStore } from "../stores/boardStore"
import { queryClient } from "../queryClient"
import { toast } from "sonner"

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
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
    onError: () => {
      toast.error("Failed to reorder lists");
    },
  });
};