import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { WishlistItem, Product } from "@/types/index"

interface WishlistStore {
    items: WishlistItem[]
    addToWishlist: (product: Product) => void
    removeFromWishlist: (productId: string) => void
    clearWishlist: () => void
    isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],

            addToWishlist: (product) => {
                const { items } = get()
                const existingItem = items.find((item) => item.product.id === product.id)

                if (!existingItem) {
                    const newItem: WishlistItem = {
                        id: `wishlist-${Date.now()}-${product.id}`,
                        product,
                        addedAt: new Date(),
                    }
                    set({ items: [...items, newItem] })
                }
            },

            removeFromWishlist: (productId) => {
                set({ items: get().items.filter((item) => item.product.id !== productId) })
            },

            clearWishlist: () => {
                set({ items: [] })
            },

            isInWishlist: (productId) => {
                return get().items.some((item) => item.product.id === productId)
            },
        }),
        {
            name: "wishlist-storage",
        },
    ),
)
