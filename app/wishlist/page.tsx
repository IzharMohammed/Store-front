"use client"

import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWishlistStore } from "@/stores/wishlist-store"
import { useCartStore } from "@/stores/cart-store"
import { formatCurrency } from "@/lib/format"

export default function WishlistPage() {
  const { items, remove } = useWishlistStore()
  const add = useCartStore((s) => s.add)

  return (
    <main>
      <SiteHeader />
      <section className="container mx-auto px-4 py-6 md:py-8">
        <Card>
          <CardHeader>
            <CardTitle>Wishlist</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {items.length === 0 && <div className="text-sm text-muted-foreground">No items yet.</div>}
            {items.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <Image
                  src={p.image ?? "/placeholder.svg?height=80&width=80&query=product"}
                  alt={p.name}
                  width={80}
                  height={80}
                  className="rounded border object-cover w-20 h-20"
                />
                <div className="flex-1">
                  <Link href={`/product/${p.id}`} className="font-medium hover:underline">
                    {p.name}
                  </Link>
                  <div className="text-sm text-muted-foreground">{formatCurrency(p.price)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => add(p, 1)}>Add to cart</Button>
                  <Button variant="outline" onClick={() => remove(p.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
