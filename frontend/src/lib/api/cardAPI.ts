import { api } from "../contexts/authContext";
import { ReOrderCardURL } from "../helper/urls";
import type { Card, Comment } from "../objects/data";

export const reorderCards = async (cards: { id: number, list:number, order:number }[]) => {
    const { data } = await api.post(ReOrderCardURL, { cards })
    return data
}

export const deleteCard = async (boardId: number, listId: number, cardId: number) => {
    const { data } = await api.delete(`boards/${boardId}/lists/${listId}/cards/${cardId}/`)
    return data
}

export const createCard = async (boardId: number, listId: number, title: string, card_type: "paragraph" | "checkbox", description: string = "", checkbox_items: { text: string; checked: boolean }[] = []) => {
    const { data } = await api.post(`boards/${boardId}/lists/${listId}/cards/`, { title, card_type, description, checkbox_items })
    return data
}

export const updateCard = async (boardId: number, listId: number, cardId: number, newData: Partial<Card>) => {
    const { data } = await api.patch(`boards/${boardId}/lists/${listId}/cards/${cardId}/`, newData)
    return data
}

export const createComment = async(cardId: number, content: string) => {
    const { data } = await api.post(`cards/${cardId}/comments/`, { content })
    return data
}

export const fetchComments = async (cardId: number): Promise<Comment[]> => {
    const { data } = await api.get(`cards/${cardId}/comments/`)
    return data
}