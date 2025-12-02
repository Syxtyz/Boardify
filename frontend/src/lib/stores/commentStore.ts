import { create } from "zustand"
import type { Comment } from "../objects/data"

interface CommentState {
    comments: Comment[]
    setComments: (comment: Comment[]) => void
    addComment: (comment: Comment) => void
    clearComments: () => void
}

export const CommentStore = create<CommentState>((set) => ({
    comments: [],
    setComments: (comments) => set({ comments }),
    addComment: (comment) => set((state) => ({ comments: [comment, ...state.comments]})),
    clearComments: () => ({ comments: [] }),
}))