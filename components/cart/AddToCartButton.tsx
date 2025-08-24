"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddToCartButtonProps {
  productId: string;
  productName?: string;
  quantity?: number;
  className?: string;
  disabled?: boolean;
}

interface AddToCartResponse {
  success: boolean;
  message: string;
}

export default function AddToCartButton({
  productId,
  productName = "Product",
  quantity = 1,
  className = "",
  disabled = false,
}: AddToCartButtonProps) {
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }): Promise<AddToCartResponse> => {
      const token = localStorage.getItem("auth_token");
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/cart`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ productId, quantity }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to cart");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      alert(`${productName} added to cart successfully!`);
    },
    onError: (error: any) => {
      console.error("Add to cart failed:", error);
      if (error.message.includes("already in cart")) {
        alert(`${productName} is already in your cart`);
      } else {
        alert(`Failed to add ${productName} to cart: ${error.message}`);
      }
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate({ productId, quantity });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || addToCartMutation.isPending}
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
    </button>
  );
}
