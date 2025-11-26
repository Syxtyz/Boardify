import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import { reorderCards } from "../api/card";
import { toast } from "sonner";

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