import { api } from "@/lib/contexts/authContext";

export const createBoard = async (title: string) => {
    const { data } = await api.post(`boards/`, { title })
    return data
}

export const fetchBoards = async () => {
    const { data } = await api.get(`boards/`)
    return data
}

export const fetchBoardById = async (id: number) => {
    const { data } = await api.get(`boards/${id}/`)
    return data
}

export const deleteBoard = async (id: number) => {
    const { data } = await api.delete(`boards/${id}/`)
    return data
}

export const updateBoard = async (id: number, title: string) => {
    const { data } = await api.put(`boards/${id}/`, { title })
    return data
}

export const toggleBoardPublic = async (id: number) => {
    const { data } = await api.post(`boards/${id}/toggle-public/`)
    return data
}

export const fetchBoardByPublicId = async (publicId: string) => {
    const { data } = await api.get(`boards/public/${publicId}/`)
    return data
}

export const shareBoard = async (id: number, email: string) => {
    const { data } = await api.post(`boards/${id}/share/`, { email })
    return data
}

export const unshareBoard = async (id: number, userId: number) => {
    const { data } = await api.post(`boards/${id}/unshare/`, { user_id: userId })
    return data
}

