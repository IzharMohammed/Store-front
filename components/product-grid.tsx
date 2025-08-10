import { type Product, ProductCard } from "./product-card"

export default function ProductGrid({ products = [] as Product[] }: { products?: Product[] } = { products: [] }) {
  if (!products.length) {
    return <div className="py-10 text-center text-sm text-muted-foreground">No products found.</div>
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
