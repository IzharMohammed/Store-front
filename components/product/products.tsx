import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { Product, ProductResponse } from "@/types/index";
import { Flame, TrendingUp, Sparkles, Tag } from "lucide-react";
import { getProducts } from "@/actions/products";
import Link from "next/link";

export async function Products() {
  const response = await getProducts();

  const products = response?.data || [];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 mb-4">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">Trending Now</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Hot
            </span>{" "}
            Products
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Discover our most popular and trending products
          </p>
        </div>

        {/* Tab Navigation */}

        {/* Products Grid */}
        {/* <AnimatePresence mode="wait"> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: Product, index: number) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {/* </AnimatePresence> */}

        {/* Show More Button */}
        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="group border-2 hover:bg-muted/50 transition-all duration-300 px-8"
              >
              <span className="mr-2">View All Products</span>
              <div>
                <TrendingUp className="w-4 h-4" />
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
