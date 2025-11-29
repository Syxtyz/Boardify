import { api } from "../contexts/authContext"

export const getActivityLogs = async (boardId: number) => {
    const { data } = await api.get(`boards/${boardId}/activities/`)
    return data
}