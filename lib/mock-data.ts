import type { Product } from "@/components/product-card"

export const CATEGORIES = ["Shoes", "Accessories", "Clothing", "Electronics", "Home", "General"]

export const PRODUCTS: Product[] = [
    {
        id: "p1",
        name: "Minimal Sneakers",
        price: 89.99,
        category: "Shoes",
        image: "/placeholder.svg?height=480&width=640",
        description: "Comfortable and clean sneakers for everyday wear.",
    },
    {
        id: "p2",
        name: "Canvas Tote Bag",
        price: 29.99,
        category: "Accessories",
        image: "/placeholder.svg?height=480&width=640",
        description: "Durable tote for daily essentials.",
    },
    {
        id: "p3",
        name: "Classic Tee",
        price: 19.99,
        category: "Clothing",
        image: "/placeholder.svg?height=480&width=640",
        description: "Soft cotton t-shirt with a timeless fit.",
    },
    {
        id: "p4",
        name: "Wireless Headphones",
        price: 129.0,
        category: "Electronics",
        image: "/placeholder.svg?height=480&width=640",
        description: "Noise-reduced listening with long battery life.",
    },
    {
        id: "p5",
        name: "Ceramic Mug",
        price: 12.5,
        category: "Home",
        image: "/placeholder.svg?height=480&width=640",
        description: "Simple mug for coffee or tea.",
    },
    {
        id: "p6",
        name: "Slim Fit Jeans",
        price: 59.0,
        category: "Clothing",
        image: "/placeholder.svg?height=480&width=640",
        description: "Stretch denim, slim fit profile.",
    },
    {
        id: "p7",
        name: "Leather Wallet",
        price: 49.0,
        category: "Accessories",
        image: "/placeholder.svg?height=480&width=640",
        description: "Compact wallet crafted from genuine leather.",
    },
    {
        id: "p8",
        name: "Running Shoes",
        price: 99.0,
        category: "Shoes",
        image: "/placeholder.svg?height=480&width=640",
        description: "Lightweight running shoes with breathable mesh.",
    },
]
