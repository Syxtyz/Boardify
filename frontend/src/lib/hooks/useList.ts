import { useMutation } from "@tanstack/react-query"
import { createList } from "../api/listAPI"
import { BoardStore } from "../stores/boardStore"
import { queryClient } from "../queryClient"

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