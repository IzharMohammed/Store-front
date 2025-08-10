"use client"

import { useState } from "react"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { useProductStore } from "@/stores/product-store"

export default function ProductsPage() {
  const { products, filteredProducts, setFilters, filters } = useProductStore()
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}>
          <ProductFilters />
        </div>
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">All Products</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              Filters
            </button>
          </div>
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  )
}
