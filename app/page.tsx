import { HeroBanner } from "@/components/hero-banner";
import { Products } from "@/components/product/products";
import { Categories } from "@/components/categories";
import { FeaturedProducts } from "@/components/product/featured-products";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroBanner />
      <div className="container mx-auto px-4">
        <Categories />
        <Products />
        {/* <FeaturedProducts /> */}
      </div>
    </div>
  );
}
