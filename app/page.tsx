import { HeroBanner } from "@/components/hero-banner";
import { HotProducts } from "@/components/hot-products";
import { Categories } from "@/components/categories";
import { FeaturedProducts } from "@/components/featured-products";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroBanner />
      <div className="container mx-auto px-4">
        <Categories />
        <HotProducts />
        <FeaturedProducts />
      </div>
    </div>
  );
}
