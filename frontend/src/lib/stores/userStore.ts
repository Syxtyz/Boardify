import { create } from "zustand";
import type { User } from "../objects/data";
import { persist } from "zustand/middleware"

interface UserState {
    user: User | null
    setUser: (user: User | null) => void
    clearUser: () => void
}

export const UserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => {set({ user: null }), localStorage.removeItem("user")}
        }),
        {
            name: "user",
            partialize: (state) => ({
                user: state.user ? { id: state.user.id, username: state.user.username, email: state.user.email } : null
            })
        }
    )
)