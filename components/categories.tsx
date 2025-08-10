"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

const categories = [
  { id: "electronics", name: "Electronics", image: "/placeholder.svg?height=200&width=200" },
  { id: "clothing", name: "Clothing", image: "/placeholder.svg?height=200&width=200" },
  { id: "home", name: "Home & Garden", image: "/placeholder.svg?height=200&width=200" },
  { id: "sports", name: "Sports", image: "/placeholder.svg?height=200&width=200" },
  { id: "books", name: "Books", image: "/placeholder.svg?height=200&width=200" },
  { id: "beauty", name: "Beauty", image: "/placeholder.svg?height=200&width=200" },
]

export function Categories() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/products?category=${category.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                  <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
                </div>
                <h3 className="font-medium">{category.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
