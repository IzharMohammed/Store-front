"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/index";

const tabs = [
  { id: "featured", label: "Featured" },
  { id: "bestsellers", label: "Best Sellers" },
  { id: "new", label: "New Arrivals" },
  { id: "sale", label: "On Sale" },
];

// Update the return type to match your API response
async function fetchProducts(): Promise<{ products: Product[] }> {
  const response = await fetch("/api/v1/products", {
    method: "GET",
  });
  return response.json();
}

export function HotProducts() {
  const [activeTab, setActiveTab] = useState("featured");

  const {
    data: response, // Changed from 'products' to 'response'
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Extract the products array from the response
  const products = response?.products || [];

  console.log("Full response:", response);
  console.log("Products array:", products);

  if (isLoading) return <div>loading...</div>;
  if (isError) return <p>Error:- {(error as Error).message}</p>;

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
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
