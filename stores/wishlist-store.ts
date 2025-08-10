"use client"

import { create } from "zustand"
import type { ProductWithMeta } from "@/types"

type WishlistState = {
  items: ProductWithMeta[]
  toggle: (product: ProductWithMeta) => void
  remove: (id: string) => void
  has: (id: string) => boolean
  count: number
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  toggle: (p) =>
    set((s) => {
      const exists = s.items.find((i) => i.id === p.id)
      return exists ? { items: s.items.filter((i) => i.id !== p.id) } : { items: [...s.items, p] }
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  has: (id) => !!get().items.find((i) => i.id === id),
  get count() {
    return get().items.length
  },
}))
