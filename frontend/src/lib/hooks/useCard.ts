import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import { reorderCards } from "../api/card";
import { toast } from "sonner";

export const useReorderCardMutation = (boardId: number) => {
  return useMutation({
    mutationFn: (cards: { id: number; list: number; order: number }[]) => reorderCards(cards),
    onSuccess: () => {
      // Invalidate the board query so the latest data is fetched
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
      toast.success("Cards reordered successfully!");
    },
    onError: () => {
      toast.error("Failed to reorder cards");
    },
  });
};