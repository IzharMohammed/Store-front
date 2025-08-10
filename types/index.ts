export type Product = {
  id: string
  name: string
  description?: string | null
  price: number
  stock: number
  image?: string | null
  status: "ACTIVE" | "INACTIVE"
  category: string
  storeId: string
  createdAt: string
}

export type Feedback = {
  id: string
  rating: number
  comment?: string | null
  createdAt: string
  userId: string
  productId: string
}

export type OrderItem = {
  id: string
  quantity: number
  price: number
  productId: string
}

export type Order = {
  id: string
  total: number
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  address?: string | null
  customerEmail?: string | null
  customerName?: string | null
  customerPhone?: string | null
  shippingAddress?: Record<string, unknown> | null
  billingAddress?: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
  customerId: string
  storeId: string
  items: OrderItem[]
}

export type ProductWithMeta = Product & {
  avgRating?: number
  reviewCount?: number
}
