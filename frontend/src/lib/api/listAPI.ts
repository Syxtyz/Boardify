import { api } from "../contexts/authContext";

export const createList = async (boardId: number, title: string) => {
    const { data } = await api.post(`boards/${boardId}/lists/`, { title })
    return data
}