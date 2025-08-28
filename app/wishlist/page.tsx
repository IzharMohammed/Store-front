import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingCart,
  ArrowRight,
  Shield,
  Zap,
  Award,
  Package,
} from "lucide-react";
import { WishlistItem } from "@/types/wishlist";
import EmptyWishlist from "@/components/wishlist/empty-wishlist";
import { getWishlistItems } from "@/actions/wishlist";
import { WishlistItemActions } from "@/components/wishlist/wishlist-item-actions";
import AddToCartButton from "@/components/cart/AddToCartButton";

// Order Summary Component
interface OrderSummaryProps {
  items: WishlistItem[];
  itemCount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, itemCount }) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price, 0);
  const savings = subtotal * 0.15; // 15% savings example
  const total = subtotal - savings;

  return (
    <div className="sticky top-8">
      <Card className="border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Wishlist Summary</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span>Subtotal ({itemCount} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>You save</span>
              <span>-${savings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-purple-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>Fast Ship</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>Quality</span>
            </div>
          </div>

          <div className="space-y-3">
            {/* <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 font-semibold shadow-sm hover:shadow-md transition-all duration-200 border-0">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add All to Cart
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button> */}
            <Button
              variant="outline"
              className="w-full border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              asChild
            >
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Wishlist item card component
interface WishlistCardProps {
  item: WishlistItem;
}

const WishlistCard: React.FC<WishlistCardProps> = ({ item }) => {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Product Image */}
          <div className="relative">
            <div className="w-full sm:w-24 h-48 sm:h-24 relative rounded-lg overflow-hidden bg-gradient-to-br from-muted/20 to-muted/40">
              <Image
                src={item.product.image || "/placeholder.jpg"}
                alt={item.product.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            {/* Remove button handled by WishlistItemActions */}
            <div className="absolute -top-2 -right-2">
              <WishlistItemActions
                itemId={item.id}
                productName={item.product.name}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-3">
            <div>
              <Link href={`/products/${item.product.id}`}>
                <h3 className="font-semibold hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                  {item.product.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {item.product.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {item.product.category}
              </Badge>
              {item.product.stock <= 5 && item.product.stock > 0 && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  Only {item.product.stock} left!
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                ${item.product.price.toFixed(2)} each
              </span>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col items-end gap-4 sm:min-w-[120px]">
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ${item.product.price.toFixed(2)}
              </div>
            </div>

            {/* <Button disabled={item.product.stock === 0}> */}
            {/* <ShoppingCart className="w-4 h-4 mr-2" /> */}
            {item.product.stock === 0 ? (
              "Out of Stock"
            ) : (
              <AddToCartButton productId={item.productId} />
            )}
            {/* </Button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
export default async function WishlistPage() {
  const wishlistData = await getWishlistItems();
  const wishlistItems = wishlistData?.data || [];

  // Empty state
  if (!wishlistItems.length) {
    return <EmptyWishlist />;
  }

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">Wishlist</h1>
                  <p className="text-muted-foreground">
                    {wishlistData?.count || 0} items in your wishlist
                  </p>
                </div>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <WishlistCard key={item.id} item={item} />
              ))}
            </div>

            {/* You might also like section */}
            <div className="mt-16">
              <Card className="border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-purple-600" />
                    <h2 className="text-xl font-semibold">
                      You might also like
                    </h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Based on items in your wishlist
                  </p>
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    Recommendations will appear here
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={wishlistItems}
              itemCount={wishlistData?.count || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
