import { create } from "zustand"
import type { Product, ProductFilters } from "@/types/index"
// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    stock: 15,
    image: "/placeholder.svg?height=300&width=300",
    status: "ACTIVE",
    category: "Electronics",
    createdAt: new Date(),
    storeId: "store1",
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health tracking",
    price: 299.99,
    stock: 8,
    image: "/placeholder.svg?height=300&width=300",
    status: "ACTIVE",
    category: "Electronics",
    createdAt: new Date(),
    storeId: "store1",
  },
  {
    id: "3",
    name: "Running Shoes",
    description: "Comfortable running shoes for all terrains",
    price: 129.99,
    stock: 25,
    image: "/placeholder.svg?height=300&width=300",
    status: "ACTIVE",
    category: "Sports",
    createdAt: new Date(),
    storeId: "store1",
  },
  {
    id: "4",
    name: "Coffee Maker",
    description: "Automatic coffee maker with programmable settings",
    price: 89.99,
    stock: 12,
    image: "/placeholder.svg?height=300&width=300",
    status: "ACTIVE",
    category: "Home & Garden",
    createdAt: new Date(),
    storeId: "store1",
  },
  {
    id: "5",
    name: "Laptop Backpack",
    description: "Durable laptop backpack with multiple compartments",
    price: 59.99,
    stock: 30,
    image: "/placeholder.svg?height=300&width=300",
    status: "ACTIVE",
    category: "Electronics",
    createdAt: new Date(),
    storeId: "store1",
  },
  {
    id: "6",
    name: "Yoga Mat",
    description: "Non-slip yoga mat for comfortable workouts",
    price: 39.99,
    stock: 20,
    image: "/placeholder.svg?height=300&width=300",
    status: "ACTIVE",
    category: "Sports",
    createdAt: new Date(),
    storeId: "store1",
  },
  {
    id: "7",
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with excellent sound quality",
    price: 79.99,
    stock: 18,
    image: "/placeholder.svg?height=300&width=300",
    status: "ACTIVE",
    category: "Electronics",
    createdAt: new Date(),
    storeId: "store1",
  },
  {
    id: "8",
    name: "Skincare Set",
    description: "Complete skincare routine set for all skin types",
    price: 149.99,
    stock: 10,
    image: "/placeholder.svg?height=300&width=300",
    status: "ACTIVE",
    category: "Beauty",
    createdAt: new Date(),
    storeId: "store1",
  },
]

interface ProductStore {
  products: Product[]
  filters: ProductFilters
  filteredProducts: Product[]
  setFilters: (filters: ProductFilters) => void
  clearFilters: () => void
  getProductById: (id: string) => Product | undefined
}

const defaultFilters: ProductFilters = {
  categories: [],
  priceRange: [0, 1000],
  inStock: false,
  search: "",
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: mockProducts,
  filters: defaultFilters,
  filteredProducts: mockProducts,

  setFilters: (filters) => {
    const { products } = get()

    const filtered = products.filter((product) => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }

      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      // Stock filter
      if (filters.inStock && product.stock === 0) {
        return false
      }

      // Search filter
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      return true
    })

    set({ filters, filteredProducts: filtered })
  },

  clearFilters: () => {
    set({ filters: defaultFilters, filteredProducts: get().products })
  },

  getProductById: (id) => {
    return get().products.find((product) => product.id === id)
  },
}))
