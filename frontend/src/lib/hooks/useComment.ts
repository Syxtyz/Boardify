import { useMutation, useQuery } from "@tanstack/react-query"
import { CommentStore } from "../stores/commentStore"
import { createComment, fetchComments } from "../api/cardAPI"
import { queryClient } from "../queryClient"

export const useComments = (cardId: number) => {
  const { setComments } = CommentStore();

  return useQuery({
    queryKey: ["comments", cardId],
    queryFn: async () => {
      const data = await fetchComments(cardId)
      setComments(data)
      return data
    },
    enabled: !!cardId,
  })
}

export const useCreateComment = () => {
    const { addComment } = CommentStore()

    return useMutation({
        mutationFn: ({ cardId, content }: { cardId: number, content: string }) => createComment(cardId, content),
        onSuccess: (data, variables) => {
            addComment(data)
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "comments" && query.queryKey[1] === variables.cardId })
        }
    })
}