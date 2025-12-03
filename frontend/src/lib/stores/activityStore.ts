import { create } from "zustand";
import type { ActivityLog } from "../objects/data";
import { getActivityLogs } from "../api/logsAPI";

interface ActivityState {
  logs: ActivityLog[];
  loading: boolean;
  offset: number;
  limit: number;
  count: number; // total logs from server
  fetchlogs: (boardId: number) => Promise<void>;
  fetchNextPage: (boardId: number) => Promise<void>;
  user: number | "all";
  setSelectedUser: (id: number | "all") => void;
  filteredLogs: () => ActivityLog[];
}

export const ActivityStore = create<ActivityState>((set, get) => ({
  logs: [],
  loading: false,
  offset: 0,
  limit: 50,
  count: 0,
  user: "all",

  fetchlogs: async (boardId) => {
    set({ loading: true, offset: 0 });
    try {
      const data = await getActivityLogs(boardId, 0);
      set({
        logs: data.results,
        offset: data.results.length,
        count: data.count,
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchNextPage: async (boardId) => {
    const { logs, offset, limit, count, loading } = get();
    if (loading || offset >= count) return;

    set({ loading: true });
    try {
      const data = await getActivityLogs(boardId, offset);
      set({
        logs: [...logs, ...data.results],
        offset: offset + data.results.length,
        count: data.count,
      });
    } finally {
      set({ loading: false });
    }
  },

  setSelectedUser: (id) => set({ user: id }),

  filteredLogs: () => {
    const { logs, user } = get();
    if (user === "all") return logs;
    return logs.filter((log) => log.user?.id === user);
  },
}));
