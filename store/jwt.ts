import { create } from "zustand"
import { persist } from "zustand/middleware"

type Store = {
  userId: string | null
  token: string | null
  updateUserId: (data: string | null) => void
  updateToken: (data: string | null) => void
}

export const useJwtStore = create<Store>()(
  persist(
    (set) => ({
      userId: null,
      token: null,
      updateUserId: (data) => set({ userId: data }),
      updateToken: (data) => set({ token: data }),
    }),
    { name: "channel-4-jwt" }
  )
)
