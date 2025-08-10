"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type CartItem = {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
}

type CartState = {
  items: CartItem[]
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void
  remove: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) =>
        set((state) => {
          const idx = state.items.findIndex((i) => i.id === item.id)
          if (idx >= 0) {
            const copy = [...state.items]
            copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty }
            return { items: copy }
          }
          return { items: [...state.items, { ...item, quantity: qty }] }
        }),
      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "cart:v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
)

// Derived selector hook
export function useCart() {
  return useCartStore((s) => {
    const total = s.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const count = s.items.reduce((sum, i) => sum + i.quantity, 0)
    return { items: s.items, add: s.add, remove: s.remove, updateQty: s.updateQty, clear: s.clear, total, count }
  })
}
