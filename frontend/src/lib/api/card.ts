import { api } from "../contexts/authContext";
import { ReOrderCardURL } from "../helper/urls";

export const reorderCards = async (cards: { id: number, list:number, order:number }[]) => {
    const { data } = await api.post(ReOrderCardURL, { cards })
    return data
}