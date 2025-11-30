import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import { createCard, deleteCard, reorderCards, updateCard } from "../api/cardAPI";
import { toast } from "sonner";
import { BoardStore } from "../stores/boardStore";
import { ListStore } from "../stores/listStore";
import type { Card, List } from "../objects/data";
import { getActivityLogs } from "../api/logsAPI";
import { ActivityStore } from "../stores/activityStore";
import { CardStore } from "../stores/cardStore";

export const useCardCreateMutation = () => {
  return useMutation({
    mutationFn: ({ boardId, listId, title, card_type, description, checkbox_items }: { boardId: number, listId: number, title: string, card_type: "paragraph" | "checkbox", description?: string, checkbox_items?: string[]}) => createCard(boardId, listId, title, card_type, description, checkbox_items),
    onSuccess: (newCard, { listId }) => {
      ListStore.setState((state) => {
        if (!state.selectedList) return {}
        const updatedList = { ...state.selectedList }
        updatedList.cards = [...updatedList.cards, newCard]

        return { selectedList: updatedList }
      })

      BoardStore.setState((state) => {
        const updatedBoard = { ...state.selectedBoard }
        const list = updatedBoard.lists.find((l: List) => l.id === listId)
        if (list) list.cards = [...list.cards, newCard]
        return { selectedBoard: updatedBoard }
      })
      queryClient.invalidateQueries({ queryKey: ["board"] })
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create card")
    }
  })
}

export const useCardUpdateMutation = () => {
  return useMutation({
    mutationFn: ({ boardId, listId, cardId, newData }: { boardId: number, listId: number, cardId: number, newData: Partial<Card>}) => updateCard(boardId, listId, cardId, newData),
    onSuccess: (updatedCard, { listId, cardId }) => {
      ListStore.setState((state) => {
        if (!state.selectedList) return {}
        const updatedList = { ...state.selectedList }
        updatedList.cards = updatedList.cards.map((c: Card) => c.id === cardId ? updatedCard: c)
        return { selectedList: updatedList }
      })
      BoardStore.setState((state) => {
        const board = { ...state.selectedBoard }
        const list = board.lists.find((l: List) => l.id === listId)
        if (list) {
          list.cards = list.cards.map((c: Card) => c.id === cardId ? updatedCard : c)
        }
        return { selectedBoard: board }
      })

      CardStore.setState({ selectedCard: updatedCard })
      queryClient.invalidateQueries({ queryKey: ['"board'] })
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update card")
    }
  })
}

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