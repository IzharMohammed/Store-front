"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import { Product, ProductResponse } from "@/types/index";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Flame, TrendingUp, Sparkles, Tag } from "lucide-react";

const tabs = [
  { id: "featured", label: "Featured", icon: Sparkles },
  { id: "bestsellers", label: "Best Sellers", icon: TrendingUp },
  { id: "new", label: "New Arrivals", icon: Flame },
  { id: "sale", label: "On Sale", icon: Tag },
];

async function fetchProducts(): Promise<ProductResponse> {
  const response = await fetch("/api/v1/products", {
    method: "GET",
  });
  return response.json();
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const productVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function Products() {
  const [activeTab, setActiveTab] = useState("featured");

  const {
    data: response,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_BACKEND_API_KEY!,
      };

      // Add custom headers if user is authenticated
      if (userData) {
        headers["x-user-id"] = userData.id;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/products`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      return response.json();
    },
  });

  const products = response?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <p className="text-red-500">Error: {(error as Error).message}</p>
      </motion.div>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 mb-4"
          >
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">Trending Now</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Hot
            </span>{" "}
            Products
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Discover our most popular and trending products
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <motion.div
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative overflow-hidden transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg text-white"
                      : "border-2 hover:bg-muted/50 hover:border-purple-300"
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  {tab.label}

                  {/* Active tab indicator */}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 -z-10"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product: Product, index: number) => (
              <motion.div
                key={`${activeTab}-${product.id}`}
                variants={productVariants}
                custom={index}
                layout
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Show More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="group border-2 hover:bg-muted/50 transition-all duration-300 px-8"
          >
            <span className="mr-2">View All Products</span>
            <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
              <TrendingUp className="w-4 h-4" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
