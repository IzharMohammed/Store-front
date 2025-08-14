// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Minus, Plus, Trash2 } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useCartStore } from "@/stores/cart-store";
// import { useRouter } from "next/navigation";

// export default function CartPage() {
//   const {
//     items,
//     updateQuantity,
//     removeFromCart,
//     getTotalPrice,
//     getTotalItems,
//   } = useCartStore();
//   const router = useRouter();

//   if (items.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-16 text-center">
//         <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
//         <p className="text-muted-foreground mb-8">Your cart is empty</p>
//         <Link href="/products">
//           <Button>Continue Shopping</Button>
//         </Link>
//       </div>
//     );
//   }

//   const handleCheckout = () => {
//     router.push("/payment");
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">
//         Your Cart ({getTotalItems()} items)
//       </h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-4">
//           {items.map((item) => (
//             <Card key={item.id}>
//               <CardContent className="p-6">
//                 <div className="flex gap-4">
//                   <div className="w-20 h-20 relative overflow-hidden rounded-md">
//                     <Image
//                       src={
//                         item.product.image ||
//                         "/placeholder.svg?height=80&width=80"
//                       }
//                       alt={item.product.name}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>

//                   <div className="flex-1">
//                     <h3 className="font-semibold">{item.product.name}</h3>
//                     <p className="text-sm text-muted-foreground">
//                       {item.product.category}
//                     </p>
//                     <p className="font-bold mt-2">${item.product.price}</p>
//                   </div>

//                   <div className="flex flex-col items-end gap-2">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => removeFromCart(item.id)}
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </Button>

//                     <div className="flex items-center border rounded-md">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() =>
//                           updateQuantity(
//                             item.id,
//                             Math.max(1, item.quantity - 1)
//                           )
//                         }
//                         disabled={item.quantity <= 1}
//                       >
//                         <Minus className="w-4 h-4" />
//                       </Button>
//                       <span className="px-3 py-1 min-w-[2rem] text-center">
//                         {item.quantity}
//                       </span>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() =>
//                           updateQuantity(item.id, item.quantity + 1)
//                         }
//                       >
//                         <Plus className="w-4 h-4" />
//                       </Button>
//                     </div>

//                     <p className="font-bold">
//                       ${(item.product.price * item.quantity).toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         <div className="lg:col-span-1">
//           <Card>
//             <CardHeader>
//               <CardTitle>Order Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>${getTotalPrice().toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Shipping</span>
//                 <span>Free</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Tax</span>
//                 <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
//               </div>
//               <Separator />
//               <div className="flex justify-between font-bold text-lg">
//                 <span>Total</span>
//                 <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
//               </div>
//               <Button onClick={handleCheckout} className="w-full" size="lg">
//                 Proceed to Checkout
//               </Button>
//               <Link href="/products">
//                 <Button variant="outline" className="w-full bg-transparent">
//                   Continue Shopping
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  addedAt: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
  };
}

interface CartResponse {
  success: boolean;
  data: CartItem[];
  count: number;
  message: string;
}

interface RemoveFromCartResponse {
  success: boolean;
  message: string;
}

export default function CartPage() {
  const queryClient = useQueryClient();

  // Fetch cart items
  const {
    data: cartData,
    isLoading: cartLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async (): Promise<CartResponse> => {
      const response = await fetch("/api/v1/cart", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      return response.json();
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (cartId: string): Promise<RemoveFromCartResponse> => {
      const response = await fetch("/api/v1/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ cartId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove from cart");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      alert("Item removed from cart successfully!");
    },
    onError: (error: any) => {
      console.error("Remove from cart failed:", error);
      alert(`Failed to remove item: ${error.message}`);
    },
  });

  const handleRemoveFromCart = (cartId: string) => {
    if (confirm("Are you sure you want to remove this item from cart?")) {
      removeFromCartMutation.mutate(cartId);
    }
  };

  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading cart: {(error as Error).message}
        </div>
      </div>
    );
  }

  const cartItems = cartData?.data || [];
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <a
            href="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Your Cart ({cartItems.length} items)
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 flex items-center gap-4"
            >
              {item.product.image && (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p className="text-gray-600 text-sm">
                  {item.product.description}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="font-semibold">${item.product.price}</span>
                  <span className="text-gray-500">Qty: {item.quantity}</span>
                  <span className="font-semibold text-blue-600">
                    Total: ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleRemoveFromCart(item.id)}
                disabled={removeFromCartMutation.isPending}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
              >
                {removeFromCartMutation.isPending ? "Removing..." : "Remove"}
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Items ({cartItems.length}):</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
              Proceed to Checkout
            </button>

            <a
              href="/products"
              className="block text-center text-blue-600 hover:text-blue-700 mt-4"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
