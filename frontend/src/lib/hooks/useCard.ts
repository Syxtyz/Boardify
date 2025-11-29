import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import { deleteCard, reorderCards } from "../api/cardAPI";
import { toast } from "sonner";
import { BoardStore } from "../stores/boardStore";
import { ListStore } from "../stores/listStore";
import type { Card, List } from "../objects/data";
import { getActivityLogs } from "../api/logsAPI";
import { ActivityStore } from "../stores/activityStore";

export const useCardDeleteMutation = () => {
  return useMutation({
    mutationFn: ({ boardId, listId, cardId }: { boardId: number, listId: number, cardId: number }) => deleteCard(boardId, listId, cardId),
    onSuccess: async (_, variables) => {
      const { boardId, listId, cardId } = variables

      ListStore.setState((state) => {
        if (!state.selectedList) return {}
        return {
          selectedList: {
            ...state.selectedList,
            cards: state.selectedList.cards.filter((c: Card) => c.id !== cardId)
          }
        }
      })

      BoardStore.setState((state) => {
        if (!state.selectedBoard) return {}

        return {
          selectedBoard: {
            ...state.selectedBoard,
            lists: state.selectedBoard.lists.map((l: List) => {
              if (l.id !== listId) return l
              return {
                ...l,
                cards: l.cards.filter((c: Card) => c.id !== cardId)
              }
            })
          }
        }
      })

      const logs = await getActivityLogs(boardId)
      ActivityStore.setState({ logs })
      queryClient.invalidateQueries({ queryKey: ["boards"]})
    }
  })
}

export const useReorderCardMutation = (boardId: number) => {
  return useMutation({
    mutationFn: (cards: { id: number; list: number; order: number }[]) => reorderCards(cards),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
    onError: () => {
      toast.error("Failed to reorder cards");
    },
  });
};