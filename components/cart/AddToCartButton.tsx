"use client";

import { addToCart } from "@/actions/cart";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  productName?: string;
  quantity?: number;
  className?: string;
  disabled?: boolean;
}

export default function AddToCartButton({
  productId,
  productName = "Product",
  quantity = 1,
  className = "",
  disabled = false,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddToCart = async () => {
    startTransition(async () => {
      try {
        await addToCart(productId, quantity);
        setIsSuccess(true);
        toast.success(`${productName} added to cart successfully!`);
        setTimeout(() => setIsSuccess(false), 3000);
      } catch (error) {
        toast.error("Failed to add to cart");
      }
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isPending}
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {/* Loading State */}
      {isPending && (
        <>
          <span>Adding...</span>
        </>
      )}

      {/* Success State */}
      {!isPending && isSuccess && (
        <>
          <div></div>
          <span>Added!</span>
        </>
      )}

      {/* Default State */}
      {!isPending && !isSuccess && (
        <>
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}
