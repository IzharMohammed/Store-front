"use client"

import { create } from "zustand"
import type { ProductWithMeta } from "@/types"

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string | null
}

type CartState = {
  items: CartItem[]
  add: (product: ProductWithMeta, qty?: number) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  count: number
  subtotal: number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  add: (p, qty = 1) =>
    set((s) => {
      const existing = s.items.find((i) => i.id === p.id)
      if (existing) {
        return {
          items: s.items.map((i) => (i.id === p.id ? { ...i, quantity: Math.min(99, i.quantity + qty) } : i)),
        }
      }
      return { items: [...s.items, { id: p.id, name: p.name, price: p.price, image: p.image, quantity: qty }] }
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  setQty: (id, qty) =>
    set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(99, qty)) } : i)) })),
  clear: () => set({ items: [] }),
  get count() {
    return get().items.reduce((sum, i) => sum + i.quantity, 0)
  },
  get subtotal() {
    return Number(
      get()
        .items.reduce((sum, i) => sum + i.price * i.quantity, 0)
        .toFixed(2),
    )
  },
}))
