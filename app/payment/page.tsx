// "use client";

// import type React from "react";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// // import { useCartStore } from "@/stores/cart-store";
// import { useRouter } from "next/navigation";

// export default function PaymentPage() {
//   // const { items, getTotalPrice, clearCart } = useCartStore();
//   //   const { toast } = useToast()
//   const router = useRouter();
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handlePayment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsProcessing(true);

//     // Simulate payment processing
//     setTimeout(() => {
//       //   toast({
//       //     title: "Payment Successful!",
//       //     description: "Your order has been placed successfully.",
//       //   })
//       // clearCart();
//       router.push("/orders");
//       setIsProcessing(false);
//     }, 2000);
//   };

//   // if (items.length === 0) {
//   //   return (
//   //     <div className="container mx-auto px-4 py-16 text-center">
//   //       <h1 className="text-2xl font-bold mb-4">Payment</h1>
//   //       <p className="text-muted-foreground">No items in cart</p>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Payment</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Shipping Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="firstName">First Name</Label>
//                   <Input id="firstName" placeholder="John" />
//                 </div>
//                 <div>
//                   <Label htmlFor="lastName">Last Name</Label>
//                   <Input id="lastName" placeholder="Doe" />
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="address">Address</Label>
//                 <Input id="address" placeholder="123 Main St" />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="city">City</Label>
//                   <Input id="city" placeholder="New York" />
//                 </div>
//                 <div>
//                   <Label htmlFor="zipCode">ZIP Code</Label>
//                   <Input id="zipCode" placeholder="10001" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Payment Information</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handlePayment} className="space-y-4">
//                 <div>
//                   <Label htmlFor="cardNumber">Card Number</Label>
//                   <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="expiry">Expiry Date</Label>
//                     <Input id="expiry" placeholder="MM/YY" />
//                   </div>
//                   <div>
//                     <Label htmlFor="cvv">CVV</Label>
//                     <Input id="cvv" placeholder="123" />
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="cardName">Name on Card</Label>
//                   <Input id="cardName" placeholder="John Doe" />
//                 </div>
//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={isProcessing}
//                 >
//                   {isProcessing
//                     ? "Processing..."
//                     : `Pay $${(getTotalPrice() * 1.1).toFixed(2)}`}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </div>

//         <div>
//           <Card>
//             <CardHeader>
//               <CardTitle>Order Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 {items.map((item) => (
//                   <div key={item.id} className="flex justify-between text-sm">
//                     <span>
//                       {item.product.name} × {item.quantity}
//                     </span>
//                     <span>
//                       ${(item.product.price * item.quantity).toFixed(2)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//               <Separator />
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
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
