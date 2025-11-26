import { api } from "../contexts/authContext";
import { ReOrderListURL } from "../helper/urls";

export const createList = async (boardId: number, title: string) => {
    const { data } = await api.post(`boards/${boardId}/lists/`, { title })
    return data
}

export const fetchList = async (boardId: number, listId: number) => {
    const { data } = await api.post(`boards/${boardId}/lists/${listId}/`)
    return data
}

export const reorderLists = async (lists: { id: number, order: number }[]) => {
    const { data } = await api.post(ReOrderListURL, { lists })
    return data
}