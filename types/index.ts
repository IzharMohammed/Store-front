import { ShippingAddress } from "./auth-order"

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  image?: string
  status: "ACTIVE" | "INACTIVE"
  category: string
  createdAt: Date
  storeId: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  addedAt: Date
}

// export interface WishlistItem {
//   id: string
//   product: Product
//   addedAt: Date
// }

export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string
  premium: boolean
  role: "STORE_OWNER" | "STORE_MEMBER" | "CUSTOMER"
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  total: number
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  address?: string
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  createdAt: string
  updatedAt: string
  shippingAddress:ShippingAddress
  customerId: string
  storeId: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  orderId: string
  productId: string
  product: Product
}

export interface ProductFilters {
  categories: string[]
  priceRange: number[]
  inStock: boolean
  search: string
}

export interface ProductResponse {
  success: boolean;
  data: Product[];
  count: number;
  message: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
