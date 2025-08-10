import type { Feedback, Order, Product, ProductWithMeta } from "@/types"

export const categories = ["Apparel", "Home", "Gadgets", "Beauty", "Outdoors", "Office"]

export const products: Product[] = [
  {
    id: "prod_1",
    name: "Classic Cotton Tee",
    description: "Soft, breathable everyday tee.",
    price: 24.99,
    stock: 120,
    image: "/plain-tshirt.png",
    status: "ACTIVE",
    category: "Apparel",
    storeId: "store_1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_2",
    name: "Minimal Ceramic Mug",
    description: "Dishwasher-safe matte finish mug.",
    price: 14.5,
    stock: 75,
    image: "/minimal-mug.png",
    status: "ACTIVE",
    category: "Home",
    storeId: "store_1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_3",
    name: "Wireless Earbuds",
    description: "Long battery life, compact case.",
    price: 69.0,
    stock: 40,
    image: "/wireless-earbuds.png",
    status: "ACTIVE",
    category: "Gadgets",
    storeId: "store_1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_4",
    name: "Desk Organizer",
    description: "Keep your workspace tidy.",
    price: 29.99,
    stock: 60,
    image: "/desk-organizer.png",
    status: "ACTIVE",
    category: "Office",
    storeId: "store_1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_5",
    name: "Stainless Water Bottle",
    description: "Insulated bottle for daily carry.",
    price: 19.99,
    stock: 90,
    image: "/placeholder-rw2f9.png",
    status: "ACTIVE",
    category: "Outdoors",
    storeId: "store_1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_6",
    name: "Gentle Face Cleanser",
    description: "Fragrance-free, suitable for all.",
    price: 11.99,
    stock: 150,
    image: "/face-cleanser.png",
    status: "ACTIVE",
    category: "Beauty",
    storeId: "store_1",
    createdAt: new Date().toISOString(),
  },
]

export const feedbacks: Feedback[] = [
  {
    id: "f1",
    rating: 5,
    comment: "Great quality!",
    createdAt: new Date().toISOString(),
    userId: "u1",
    productId: "prod_1",
  },
  { id: "f2", rating: 4, comment: "Nice fit.", createdAt: new Date().toISOString(), userId: "u2", productId: "prod_1" },
  {
    id: "f3",
    rating: 5,
    comment: "Perfect mug.",
    createdAt: new Date().toISOString(),
    userId: "u3",
    productId: "prod_2",
  },
  {
    id: "f4",
    rating: 4,
    comment: "Good value.",
    createdAt: new Date().toISOString(),
    userId: "u3",
    productId: "prod_3",
  },
]

export function withProductMeta(p: Product): ProductWithMeta {
  const f = feedbacks.filter((x) => x.productId === p.id)
  const avg = f.length ? f.reduce((s, x) => s + x.rating, 0) / f.length : undefined
  return { ...p, avgRating: avg, reviewCount: f.length }
}

export const hotProducts: ProductWithMeta[] = [products[0], products[2], products[4]].map(withProductMeta)

export const orders: Order[] = [
  {
    id: "ord_1",
    total: 44.49,
    status: "DELIVERED",
    address: "123 Main Street",
    customerEmail: "demo@acme.co",
    customerName: "Demo User",
    customerPhone: "123456789",
    shippingAddress: { line1: "123 Main Street", city: "NYC" },
    billingAddress: { line1: "123 Main Street", city: "NYC" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
    customerId: "customer_demo",
    storeId: "store_1",
    items: [
      { id: "itm_1", quantity: 1, price: 24.99, productId: "prod_1" },
      { id: "itm_2", quantity: 1, price: 19.5, productId: "prod_2" },
    ],
  },
  {
    id: "ord_2",
    total: 69.0,
    status: "SHIPPED",
    address: "456 Oak Ave",
    customerEmail: "demo@acme.co",
    customerName: "Demo User",
    customerPhone: "123456789",
    shippingAddress: { line1: "456 Oak Ave", city: "LA" },
    billingAddress: { line1: "456 Oak Ave", city: "LA" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
    customerId: "customer_demo",
    storeId: "store_1",
    items: [{ id: "itm_3", quantity: 1, price: 69.0, productId: "prod_3" }],
  },
]
