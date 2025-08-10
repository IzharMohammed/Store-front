import Image from "next/image"
import Link from "next/link"
import ProductGrid from "@/components/product-grid"
import { PRODUCTS, CATEGORIES } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const hot = PRODUCTS.slice(0, 4)
  return (
    <main className="mx-auto max-w-6xl px-4">
      <section className="my-6 overflow-hidden rounded-lg border">
        <div className="relative aspect-[21/9] w-full bg-muted">
          <Image
            src="/placeholder.svg?height=480&width=1200"
            alt="Store banner"
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4 sm:p-6">
          <h1 className="text-xl font-semibold">Welcome to Shop</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Simple, clean products for everyday life.
          </p>
          <div className="mt-4">
            <Link href="/products">
              <Button>Shop all products</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="my-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Hot products</h2>
          <Link className="text-sm underline" href="/products">
            Look all
          </Link>
        </div>
        <ProductGrid products={hot} />
      </section>

      <section className="my-10">
        <h2 className="mb-4 text-lg font-semibold">Browse by category</h2>
        <Tabs defaultValue="All">
          <TabsList className="flex w-full flex-wrap">
            <TabsTrigger value="All">All</TabsTrigger>
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c}>
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="All" className="mt-6">
            <ProductGrid products={PRODUCTS} />
          </TabsContent>
          {CATEGORIES.map((c) => (
            <TabsContent key={c} value={c} className="mt-6">
              <ProductGrid products={PRODUCTS.filter((p) => p.category === c)} />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </main>
  )
}
