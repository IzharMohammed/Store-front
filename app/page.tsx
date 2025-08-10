import { SiteHeader } from "@/components/site-header"
import { BannerCarousel } from "@/components/banner-carousel"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { hotProducts, categories, products, withProductMeta } from "@/lib/mock-data"

export default function HomePage() {
  const newest = products.slice(0, 6).map(withProductMeta)

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 py-6 md:py-8">
        <BannerCarousel />
      </section>

      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Hot products</h2>
          <Button asChild variant="link" className="px-0">
            <Link href="/products">View all</Link>
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {hotProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Browse by category</h2>
          <Button asChild variant="link" className="px-0">
            <Link href="/products">See all</Link>
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/products?category=${encodeURIComponent(c)}`}
              className="border rounded-md p-3 md:p-4 hover:bg-muted text-center text-sm"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">New arrivals</h2>
          <Button asChild variant="link" className="px-0">
            <Link href="/products?sort=new">Sort by newest</Link>
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {newest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  )
}
