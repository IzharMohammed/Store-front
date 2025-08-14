"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiResponse, WishlistResponse } from "@/types";

interface WishlistButtonProps {
  productId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  variant = "outline",
  size = "default",
  className,
}) => {
  const queryClient = useQueryClient();

  // Check if product is in wishlist
  const { data: wishlistData } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async (): Promise<WishlistResponse> => {
      const response = await fetch("/api/v1/wishlist", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch wishlist");
      return response.json();
    },
  });

  const isInWishlist =
    wishlistData?.data?.some((item) => item.productId === productId) || false;
  const wishlistItem = wishlistData?.data?.find(
    (item) => item.productId === productId
  );

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: async (): Promise<ApiResponse> => {
      const response = await fetch("/api/v1/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to wishlist");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (): Promise<ApiResponse> => {
      if (!wishlistItem) throw new Error("Item not found in wishlist");
      const response = await fetch(`/api/v1/wishlist/${wishlistItem.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove from wishlist");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlistMutation.mutate();
    } else {
      addToWishlistMutation.mutate();
    }
  };

  const isLoading =
    addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={cn(className)}
    >
      <Heart
        className={cn(
          "w-4 h-4",
          isInWishlist ? "fill-current text-red-500" : ""
        )}
      />
      {size !== "sm" && (
        <span className="ml-2">
          {isInWishlist ? "" : ""}
        </span>
      )}
    </Button>
  );
};
