"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiResponse, WishlistResponse } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"

interface WishlistButtonProps {
  productId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  onWishlistChange?: () => void; // Optional callback for parent components
}

interface AddToWishlistResponse {
  success: boolean;
  message: string;
}

interface RemoveFromWishlistResponse {
  success: boolean;
  message: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  variant = "outline",
  size = "default",
  className,
  onWishlistChange,
}) => {
  const queryClient = useQueryClient();

  // Check if product is in wishlist
  const { data: wishlistData, isLoading: isWishlistLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async (): Promise<WishlistResponse> => {
      const userData = JSON.parse(localStorage.getItem("user_data")!);

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_BACKEND_API_KEY!,
      };

      // Add custom headers if user is authenticated
      if (userData) {
        headers["x-user-id"] = userData.id;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/wishlist`,
        {
          method: "POST",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

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
    mutationFn: async ({
      productId,
    }: {
      productId: string;
    }): Promise<AddToWishlistResponse> => {
      const userData = JSON.parse(localStorage.getItem("user_data")!);
      console.log("userData", userData);

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_BACKEND_API_KEY!,
      };

      // Add custom headers if user is authenticated
      if (userData) {
        headers["x-user-id"] = userData.id;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/wishlist`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ productId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to wishlist");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast("wishlist added to cart successfully!");

      // Trigger callback if provided
      if (onWishlistChange) {
        onWishlistChange();
      }
    },
    onError: (error: any) => {
      console.error("Add to wishlist failed:", error);
      if (error.message.includes("already in wishlist")) {
        // Handle silently or show a subtle notification
        console.log("Product already in wishlist");
      } else {
        // Show error notification
        console.error(`Failed to add to wishlist: ${error.message}`);
      }
    },
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: async ({
      itemId,
    }: {
      itemId: string;
    }): Promise<RemoveFromWishlistResponse> => {
      const userData = JSON.parse(localStorage.getItem("user_data")!);
      console.log("userData", userData);

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_BACKEND_API_KEY!,
      };

      // Add custom headers if user is authenticated
      if (userData) {
        headers["x-user-id"] = userData.id;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/wishlist/${itemId}`,
        {
          method: "DELETE",
          headers,
          body: JSON.stringify({ productId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove from wishlist");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast("Item removed from wishlist")
      // Trigger callback if provided
      if (onWishlistChange) {
        onWishlistChange();
      }
    },
    onError: (error: any) => {
      console.error("Remove from wishlist failed:", error);
      console.error(`Failed to remove from wishlist: ${error.message}`);
    },
  });

  // Toggle wishlist status
  const handleToggleWishlist = () => {
    if (isInWishlist && wishlistItem) {
      removeFromWishlistMutation.mutate({ itemId: wishlistItem.id });
    } else {
      addToWishlistMutation.mutate({ productId });
    }
  };

  const isLoading =
    isWishlistLoading ||
    addToWishlistMutation.isPending ||
    removeFromWishlistMutation.isPending;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={cn(
        "h-8 w-8 p-0", // Fixed size for the icon button
        className,
        isInWishlist
          ? "text-red-500 hover:text-red-600"
          : "text-gray-500 hover:text-gray-600"
      )}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("w-4 h-4", isInWishlist ? "fill-current" : "")} />
    </Button>
  );
};
