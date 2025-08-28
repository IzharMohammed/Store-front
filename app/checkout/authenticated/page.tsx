// "use client";
// import { CreateOrderResponse, ShippingAddress } from "@/types/auth-order";
// import { CartResponse } from "@/types/cart";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { motion, AnimatePresence, Variant, Variants } from "framer-motion";
// import { useState } from "react";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// const itemVariants: Variants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       type: "spring",
//       stiffness: 300,
//       damping: 24,
//     },
//   },
// };

// const successVariants: Variants = {
//   hidden: { scale: 0, opacity: 0 },
//   visible: {
//     scale: 1,
//     opacity: 1,
//     transition: {
//       type: "spring",
//       stiffness: 400,
//       damping: 25,
//     },
//   },
// };

// export default function AuthenticatedCheckout() {
//   const queryClient = useQueryClient();
//   const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
//     street: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     country: "",
//   });
//   const [customerPhone, setCustomerPhone] = useState("");
//   const [orderSuccess, setOrderSuccess] = useState(false);

//   // Fetch cart items
//   const {
//     data: cartData,
//     isLoading: cartLoading,
//     error: cartError,
//   } = useQuery({
//     queryKey: ["cart"],
//     queryFn: async (): Promise<CartResponse> => {
//       const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
//       const headers: HeadersInit = {
//         "Content-Type": "application/json",
//         "x-api-key": process.env.NEXT_PUBLIC_BACKEND_API_KEY!,
//       };

//       if (userData?.id) {
//         headers["x-user-id"] = userData.id;
//       }

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/cart`,
//         {
//           method: "GET",
//           headers,
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch cart items");
//       }

//       return response.json();
//     },
//   });

//   // Create order mutation
//   const createOrderMutation = useMutation({
//     mutationFn: async (orderData: {
//       shippingAddress: ShippingAddress;
//       customerPhone?: string;
//       items: Array<{
//         productId: string;
//         quantity: number;
//         price: number;
//       }>;
//       total: number;
//     }): Promise<CreateOrderResponse> => {
//       const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
//       const headers: HeadersInit = {
//         "Content-Type": "application/json",
//         "x-api-key": process.env.NEXT_PUBLIC_BACKEND_API_KEY!,
//       };

//       if (userData?.id) {
//         headers["x-user-id"] = userData.id;
//       }

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/order`,
//         {
//           method: "POST",
//           headers,
//           body: JSON.stringify(orderData),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to create order");
//       }

//       return response.json();
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["cart"] });
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//       setOrderSuccess(true);
//     },
//     onError: (error: any) => {
//       console.error("Create order failed:", error);
//       alert(`Failed to create order: ${error.message}`);
//     },
//   });

//   const handleSubmitOrder = () => {
//     if (!cartData?.data || cartData.data.length === 0) {
//       alert("Your cart is empty");
//       return;
//     }

//     const items = cartData.data.map((item) => ({
//       productId: item.productId,
//       quantity: item.quantity,
//       price: item.product.price,
//     }));

//     const total = cartData.data.reduce(
//       (sum, item) => sum + item.product.price * item.quantity,
//       0
//     );

//     createOrderMutation.mutate({
//       shippingAddress,
//       customerPhone: customerPhone || undefined,
//       items,
//       total,
//     });
//   };

//   if (cartLoading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="flex justify-center items-center min-h-[400px]"
//       >
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </motion.div>
//     );
//   }

//   if (cartError || !cartData?.data || cartData.data.length === 0) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-center p-8"
//       >
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">
//           Your cart is empty
//         </h2>
//         <p className="text-gray-600">
//           Add some items to your cart before checking out.
//         </p>
//       </motion.div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <AnimatePresence mode="wait">
//         {orderSuccess ? (
//           <motion.div
//             key="success"
//             variants={successVariants}
//             initial="hidden"
//             animate="visible"
//             className="text-center p-8 bg-green-50 rounded-lg border border-green-200"
//           >
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg
//                 className="w-8 h-8 text-green-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//             <h2 className="text-2xl font-bold text-green-800 mb-2">
//               Order Placed Successfully!
//             </h2>
//             <p className="text-green-600">
//               Thank you for your order. You will receive a confirmation email
//               shortly.
//             </p>
//           </motion.div>
//         ) : (
//           <motion.div
//             key="checkout"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-8"
//           >
//             <motion.h1
//               variants={itemVariants}
//               className="text-3xl font-bold text-gray-800 text-center"
//             >
//               Checkout
//             </motion.h1>

//             {/* Order Summary */}
//             <motion.div
//               variants={itemVariants}
//               className="bg-white rounded-lg shadow-md p-6"
//             >
//               <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//               <div className="space-y-4">
//                 {cartData.data.map((item, index) => (
//                   <motion.div
//                     key={item.id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                     className="flex justify-between items-center py-2 border-b"
//                   >
//                     <div className="flex items-center space-x-3">
//                       {item.product.image && (
//                         <img
//                           src={item.product.image}
//                           alt={item.product.name}
//                           className="w-12 h-12 object-cover rounded"
//                         />
//                       )}
//                       <div>
//                         <h3 className="font-medium">{item.product.name}</h3>
//                         <p className="text-gray-600">Qty: {item.quantity}</p>
//                       </div>
//                     </div>
//                     <p className="font-semibold">
//                       ${(item.product.price * item.quantity).toFixed(2)}
//                     </p>
//                   </motion.div>
//                 ))}
//                 <div className="flex justify-between items-center pt-4 text-xl font-bold">
//                   <span>Total:</span>
//                   <span>
//                     $
//                     {cartData.data
//                       .reduce(
//                         (sum, item) => sum + item.product.price * item.quantity,
//                         0
//                       )
//                       .toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Shipping Address Form */}
//             <motion.div
//               variants={itemVariants}
//               className="bg-white rounded-lg shadow-md p-6"
//             >
//               <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Street Address *
//                   </label>
//                   <input
//                     type="text"
//                     value={shippingAddress.street}
//                     onChange={(e) =>
//                       setShippingAddress((prev) => ({
//                         ...prev,
//                         street: e.target.value,
//                       }))
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     City *
//                   </label>
//                   <input
//                     type="text"
//                     value={shippingAddress.city}
//                     onChange={(e) =>
//                       setShippingAddress((prev) => ({
//                         ...prev,
//                         city: e.target.value,
//                       }))
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     State *
//                   </label>
//                   <input
//                     type="text"
//                     value={shippingAddress.state}
//                     onChange={(e) =>
//                       setShippingAddress((prev) => ({
//                         ...prev,
//                         state: e.target.value,
//                       }))
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     ZIP Code *
//                   </label>
//                   <input
//                     type="text"
//                     value={shippingAddress.zipCode}
//                     onChange={(e) =>
//                       setShippingAddress((prev) => ({
//                         ...prev,
//                         zipCode: e.target.value,
//                       }))
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Country *
//                   </label>
//                   <input
//                     type="text"
//                     value={shippingAddress.country}
//                     onChange={(e) =>
//                       setShippingAddress((prev) => ({
//                         ...prev,
//                         country: e.target.value,
//                       }))
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Phone (Optional)
//                   </label>
//                   <input
//                     type="tel"
//                     value={customerPhone}
//                     onChange={(e) => setCustomerPhone(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             </motion.div>

//             {/* Place Order Button */}
//             <motion.div variants={itemVariants} className="text-center">
//               <motion.button
//                 onClick={handleSubmitOrder}
//                 disabled={createOrderMutation.isPending}
//                 className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 {createOrderMutation.isPending ? (
//                   <div className="flex items-center space-x-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Processing...</span>
//                   </div>
//                 ) : (
//                   "Place Order"
//                 )}
//               </motion.button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


import React from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Package,
  Truck,
  Shield,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCartItems } from "@/actions/cart";
import { CheckoutForm } from "@/components/order/checkout-form";

// Empty Cart Component
const EmptyCart: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart before checking out.
          </p>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            asChild
          >
            <Link href="/products">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Order Item Component
interface OrderItemProps {
  item: any;
  index: number;
}

const OrderItem: React.FC<OrderItemProps> = ({ item, index }) => {
  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg border bg-muted/30">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
        <Image
          src={item.product.image || "/placeholder.svg?height=64&width=64"}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground line-clamp-1">
          {item.product.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          Qty: {item.quantity} × ${item.product.price.toFixed(2)}
        </p>
        {item.product.category && (
          <Badge variant="secondary" className="mt-1 text-xs">
            {item.product.category}
          </Badge>
        )}
      </div>
      <div className="text-right">
        <p className="font-semibold text-lg text-foreground">
          ${(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

// Order Summary Component
interface OrderSummaryProps {
  items: any[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items }) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <Card className="sticky top-4 border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Items List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item, index) => (
            <OrderItem key={item.id} item={item} index={index} />
          ))}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({items.length} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Free Shipping Progress */}
        {subtotal < 100 && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm mb-2">
              <Truck className="w-4 h-4" />
              <span>
                Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!
              </span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Shield, text: "Secure" },
            { icon: Truck, text: "Fast Ship" },
            { icon: CheckCircle, text: "Quality" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex flex-col items-center gap-1">
              <Icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Checkout Page
export default async function CheckoutPage() {
  let cartData;
  
  try {
    cartData = await getCartItems();
  } catch (error) {
    console.error("Error fetching cart:", error);
    return <EmptyCart />;
  }

  const cartItems = cartData?.data || [];

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
              <p className="text-muted-foreground">
                Complete your order securely
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CheckoutForm cartItems={cartItems} />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary items={cartItems} />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
            <Shield className="w-4 h-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}