"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { removeFromCart, updateCartQuantity } from "@/actions/cart";

interface CartItemActionsProps {
  cartId: string;
  currentQuantity: number;
  productName: string;
}

export function CartItemActions({
  cartId,
  currentQuantity,
  productName,
}: CartItemActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    startTransition(async () => {
      try {
        await removeFromCart(cartId);
        toast.success("Item removed from cart!");
      } catch (error) {
        toast.error("Failed to remove item from cart");
        console.error(error);
      } finally {
        setIsRemoving(false);
      }
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;

    startTransition(async () => {
      try {
        await updateCartQuantity(cartId, newQuantity);
        toast.success("Quantity updated!");
      } catch (error) {
        toast.error("Failed to update quantity");
        console.error(error);
      }
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleQuantityChange(currentQuantity - 1)}
            disabled={isPending || currentQuantity <= 1}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="w-8 text-center font-medium">{currentQuantity}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleQuantityChange(currentQuantity + 1)}
            disabled={isPending}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Remove Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={isPending || isRemoving}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}
