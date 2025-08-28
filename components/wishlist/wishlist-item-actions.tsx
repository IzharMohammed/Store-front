"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { removeFromWishlist } from "@/actions/wishlist";

interface WishlistItemActionsProps {
  itemId: string;
  productName: string;
}

export function WishlistItemActions({
  itemId,
  productName,
}: WishlistItemActionsProps) {
  const [isPending, setIsPending] = useState(false);

  const handleRemove = async () => {
    setIsPending(true);

    try {
      const result = await removeFromWishlist(itemId);

      if (result.success) {
        toast.success(result.message);
        // The page will automatically refresh due to revalidateTag in the server action
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item from wishlist");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRemove}
      disabled={isPending}
      className="w-6 h-6 p-0 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
      aria-label={`Remove ${productName} from wishlist`}
    >
      <Trash2 className="w-3 h-3" />
    </Button>
  );
}
