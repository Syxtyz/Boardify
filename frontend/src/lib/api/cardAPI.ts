import { api } from "../contexts/authContext";
import { ReOrderCardURL } from "../helper/urls";

export const reorderCards = async (cards: { id: number, list:number, order:number }[]) => {
    const { data } = await api.post(ReOrderCardURL, { cards })
    return data
}

export const deleteCard = async (boardId: number, listId: number, cardId: number) => {
    const { data } = await api.delete(`boards/${boardId}/lists/${listId}/cards/${cardId}/`)
    return data
}