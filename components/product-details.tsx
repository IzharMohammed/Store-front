"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import AddToCartButton from "./cart/AddToCartButton";

export function ProductDetails({ product }: { product: any }) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      {/* Image - Left side */}
      <div className="relative w-full h-96">
        <Image
          src={product?.image || "/placeholder.svg?height=300&width=300"}
          alt={product?.name || "Product image"}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Details - Right side */}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{product?.name}</h1>
        <p className="text-gray-600">{product?.description}</p>
        <p className="text-lg font-semibold text-purple-600">
          ${product?.price}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">(4.5)</span>
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black dark:from-slate-200 dark:to-white dark:hover:from-white dark:hover:to-slate-100 dark:text-black border-0 shadow-lg transition-all duration-300"
        />

        {/* Extra Details */}
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <p key={i} className="text-gray-500">
              Extra product details line {i + 1}...
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
