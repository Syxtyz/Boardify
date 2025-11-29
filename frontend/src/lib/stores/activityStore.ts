import { create } from "zustand"
import type { ActivityLog } from "../objects/data"
import { getActivityLogs } from "../api/logsAPI"

interface ActivityState {
    logs: ActivityLog[],
    loading: boolean,
    fetchlogs: (boardId: number) => Promise<void>
}

export const ActivityStore = create<ActivityState>((set) => ({
    logs: [],
    loading: false,
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
    }
}))