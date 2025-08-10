"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useProductStore } from "@/stores/product-store";

const tabs = [
  { id: "featured", label: "Featured" },
  { id: "bestsellers", label: "Best Sellers" },
  { id: "new", label: "New Arrivals" },
  { id: "sale", label: "On Sale" },
];

export function HotProducts() {
  const [activeTab, setActiveTab] = useState("featured");
  const { products } = useProductStore();

  // Mock filtering logic - in real app, this would come from API
  const getFilteredProducts = () => {
    return products.slice(0, 8); // Show first 8 products for demo
  };

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Hot Products</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {getFilteredProducts().map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
