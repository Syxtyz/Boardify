import { useEffect, useState } from "react";
import { api } from "../contexts/authContext";
import type { Board } from "../types/interfaces/data";

export function useFetch(onBoardSelect?: (board: Board | null) => void) {
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        setLoading(true);
        try {
            const res = await api.get<Board[]>("boards/");
            setBoards(res.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to fetch boards");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createBoard = async (title = "New Board") => {
        try {
            const res = await api.post<Board>("boards/", { title });
            setBoards((prev) => [...prev, res.data]);
            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to create board");
            console.error(err);
        }
    };

    const selectBoard = async (boardId: number) => {
        try {
            const res = await api.get<Board>(`boards/${boardId}/`);
            if (onBoardSelect) onBoardSelect(res.data);
            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to load board details");
            console.error(err);
        }
    };

  return { boards, loading, error, fetchBoards, createBoard, selectBoard, };
}
