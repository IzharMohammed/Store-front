import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Order } from "@/types/index"

interface OrderStore {
    orders: Order[]
    addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void
    getOrderById: (id: string) => Order | undefined
}

export const useOrderStore = create<OrderStore>()(
    persist(
        (set, get) => ({
            orders: [],

            addOrder: (orderData) => {
                const newOrder: Order = {
                    ...orderData,
                    id: `order-${Date.now()}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
                set({ orders: [...get().orders, newOrder] })
            },

            getOrderById: (id) => {
                return get().orders.find((order) => order.id === id)
            },
        }),
        {
            name: "order-storage",
        },
    ),
)
