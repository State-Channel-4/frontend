import { create } from "zustand"
import { persist } from "zustand/middleware"

type Element = {
  object: any
  type: string
  receipt: string
}

type Store = {
  list: string
  updateList: (data: Element) => void
}

export const useReceiptsStore = create<Store>()(
  persist(
    (set, get) => ({
      list: "[]",
      updateList: (data) => {
        const { list } = get()
        const listObj = JSON.parse(list)
        listObj.push(data)
        set({ list: JSON.stringify(listObj) })
      },
    }),
    { name: "channel-4-receipts" }
  )
)
