import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Product } from "@/types/index"

interface CartStore {
    items: CartItem[]
    addToCart: (product: Product, quantity: number) => void
    removeFromCart: (itemId: string) => void
    updateQuantity: (itemId: string, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
    getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (product, quantity) => {
                const { items } = get()
                const existingItem = items.find((item) => item.product.id === product.id)

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
                        ),
                    })
                } else {
                    const newItem: CartItem = {
                        id: `cart-${Date.now()}-${product.id}`,
                        product,
                        quantity,
                        addedAt: new Date(),
                    }
                    set({ items: [...items, newItem] })
                }
            },

            removeFromCart: (itemId) => {
                set({ items: get().items.filter((item) => item.id !== itemId) })
            },

            updateQuantity: (itemId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(itemId)
                    return
                }

                set({
                    items: get().items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
                })
            },

            clearCart: () => {
                set({ items: [] })
            },

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0)
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0)
            },
        }),
        {
            name: "cart-storage",
        },
    ),
)
