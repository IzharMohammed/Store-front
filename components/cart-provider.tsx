"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void
  remove: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = "cart:v1"

export function CartProvider({ children }: { children?: React.ReactNode } = { children: null }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const api: CartContextType = useMemo(() => {
    return {
      items,
      add: (item, qty = 1) => {
        setItems((prev) => {
          const idx = prev.findIndex((i) => i.id === item.id)
          if (idx >= 0) {
            const copy = [...prev]
            copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty }
            return copy
          }
          return [...prev, { ...item, quantity: qty }]
        })
      },
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      updateQty: (id, qty) =>
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i))),
      clear: () => setItems([]),
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: items.reduce((sum, i) => sum + i.quantity, 0),
    }
  }, [items])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
//   if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
