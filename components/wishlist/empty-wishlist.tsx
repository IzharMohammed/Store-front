import { ArrowRight, ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";

// Empty cart component
export default function EmptyWishlist() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground" />
          </div>

          <h1 className="text-4xl font-bold mb-4">Your wishlist is Empty</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your wishlist yet. Start
            exploring our amazing products!
          </p>

          <div className="space-y-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              asChild
            >
              <Link href="/products">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Start Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto">
              {["Electronics", "Clothing", "Home & Garden"].map((category) => (
                <Card
                  key={category}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-background to-muted/30"
                >
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold mb-2">{category}</h3>
                    <p className="text-sm text-muted-foreground">
                      Explore {category.toLowerCase()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
