import { api } from "../contexts/authContext"

export const getActivityLogs = async (boardId: number, offset = 0) => {
    const { data } = await api.get(`boards/${boardId}/activities/`, { params: { limit: 50, offset } })
    return data
}