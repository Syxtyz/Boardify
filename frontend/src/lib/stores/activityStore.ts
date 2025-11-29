import { create } from "zustand"
import type { ActivityLog } from "../objects/data"
import { getActivityLogs } from "../api/logsAPI"

interface ActivityState {
    logs: ActivityLog[],
    loading: boolean,
    fetchlogs: (boardId: number) => Promise<void>
    user: number | "all"
    setSelectedUser: (id: number | "all") => void
    filteredLogs: () => ActivityLog[]
}

export const ActivityStore = create<ActivityState>((set, get) => ({
    logs: [],
    loading: false,
    user: "all",
    fetchlogs: async (boardId: number) => {
        set({ loading: true })
        try {
            const res = await getActivityLogs(boardId);
            set({ logs: res })
        } catch (err) {
            console.error("Error fetching activity logs:", err);
            set({ logs: [] });
        } finally {
            set({ loading: false });
        }
    },
    setSelectedUser: (id) => set({ user: id }),
    filteredLogs: () => {
        const { logs, user } = get()
        if (user === 'all') return logs
        return logs.filter((log) => log.user?.id === user)
    }
}))