"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/utils/format";
import { toast } from "sonner";
import {
  addToWishlist,
  getWishlistItems,
  removeFromWishlist,
} from "@/actions/wishlist";

interface WishlistButtonProps {
  productId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  wishlistData: any;
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
  wishlistData,
  productId,
  variant = "outline",
  size = "default",
  className,
  onWishlistChange,
}) => {
  const [isPending, startTransition] = useTransition();

  const isInWishlist =
    wishlistData?.data?.some((item: any) => item.productId === productId) ||
    false;
  const wishlistItem = wishlistData?.data?.find(
    (item: any) => item.productId === productId
  );

  // Toggle wishlist status
  const handleToggleWishlist = async () => {
    if (isInWishlist && wishlistItem) {
      startTransition(async () => {
        try {
          await removeFromWishlist(wishlistItem.id);
          toast.success("Item removed from wishlist");
        } catch (error) {
          toast.error("Failed to remove item from wishlist");
        }
      });
      // removeFromWishlistMutation.mutate({ itemId: wishlistItem.id });
    } else {
      startTransition(async () => {
        try {
          await addToWishlist(productId);
          toast.success("Item added to wishlist");
        } catch (error) {
          toast.error("Failed to add item to wishlist");
        }
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWishlist}
      disabled={isPending}
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