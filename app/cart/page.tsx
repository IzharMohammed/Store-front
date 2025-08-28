import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingBag,
  ArrowRight,
  Heart,
  Truck,
  Shield,
  CreditCard,
  Package,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCartItems } from "@/actions/cart";
import EmptyCart from "@/components/cart/empty-cart";
import { CartItemActions } from "@/components/cart/cart-item-actions";

export default async function CartPage() {
  const cartData = await getCartItems();
  const cartItems = cartData?.data || [];

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const savings = totalAmount * 0.15; // Mock savings
  const shipping = totalAmount > 100 ? 0 : 9.99;
  const finalTotal = totalAmount + shipping;

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
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm hover:shadow-xl transition-all duration-500"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-muted/20 to-muted/40 shrink-0">
                        <Image
                          src={
                            item.product.image ||
                            "/placeholder.svg?height=128&width=128"
                          }
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Link href={`/product/${item.product.id}`}>
                              <h3 className="font-bold text-lg md:text-xl hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer">
                                {item.product.name}
                              </h3>
                            </Link>
                            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                              {/* {item.product.description} */}
                            </p>
                          </div>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <CartItemActions
                              cartId={item.id}
                              currentQuantity={item.quantity}
                              productName={item.product.name}
                            />
                            <div className="text-sm text-muted-foreground">
                              ${item.product.price} each
                            </div>
                          </div>

                          {/* Total Price */}
                          <div className="text-right">
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>You save</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {totalAmount < 100 && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm mb-2">
                      <Truck className="w-4 h-4" />
                      <span>
                        Add ${(100 - totalAmount).toFixed(2)} more for FREE
                        shipping!
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(totalAmount / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { icon: Shield, text: "Secure" },
                    { icon: Truck, text: "Fast Ship" },
                    { icon: Star, text: "Quality" },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex flex-col items-center gap-1"
                    >
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Checkout Button */}
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg"
                  asChild
                >
                  <Link href="/checkout/authenticated">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>

                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                You might also like
              </h3>
              <p className="text-muted-foreground mb-6">
                Based on items in your cart
              </p>
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                Recommendations will appear here
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
