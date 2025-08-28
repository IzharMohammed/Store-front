"use client";

import { ProductCard } from "@/components/product/product-card";
// import { useProductStore } from "@/stores/product-store";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FeaturedProducts() {
  // const { products } = useProductStore();

  // Show first 4 products as featured
  // const featuredProducts = products.slice(0, 4);

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <p className="text-muted-foreground">
          Discover our handpicked selection of amazing products
        </p>
      </div>
      {/* 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div> */}

      <div className="text-center">
        <Link href="/products">
          <Button size="lg">View All Products</Button>
        </Link>
      </div>
    </section>
  );
}
