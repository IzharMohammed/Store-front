"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type WishlistItem = {
  id: string
  name: string
  price: number
  image?: string
}

type WishlistContextType = {
  items: WishlistItem[]
  toggle: (item: WishlistItem) => void
  has: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | null>(null)
const STORAGE_KEY = "wishlist:v1"

export function WishlistProvider({ children }: { children?: React.ReactNode } = { children: null }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const api: WishlistContextType = useMemo(
    () => ({
      items,
      toggle: (item) =>
        setItems((prev) => {
          const exists = prev.some((i) => i.id === item.id)
          return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item]
        }),
      has: (id) => items.some((i) => i.id === id),
    }),
    [items],
  )

  return <WishlistContext.Provider value={api}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}
