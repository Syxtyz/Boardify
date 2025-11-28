import { api } from "../contexts/authContext"

export const getCurrentUser = async () => {
    const { data } = await api.get(`user/`)
    return data
}