import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import AddToCartButton from "./cart/AddToCartButton";
import { WishlistButton } from "./wishlist/wishlistButton";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  status: string;
  createdAt: string;
  storeId: string;
}

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  const isInStock = product.stock > 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <a href="/" className="text-muted-foreground hover:text-foreground">
            Home
          </a>
          <span className="mx-2 text-muted-foreground">/</span>
          <a
            href="/products"
            className="text-muted-foreground hover:text-foreground"
          >
            Products
          </a>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">{product.category}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Product Image */}
          <div className="flex flex-col-reverse">
            <div className="aspect-w-1 aspect-h-1 w-full">
              <div className="relative h-96 w-full overflow-hidden rounded-lg border">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="h-full w-full object-cover object-center"
                  priority
                />
                {!isInStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg px-4 py-2">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="mb-4">
                {product.category}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3">
              <p className="text-3xl font-bold">{formattedPrice}</p>
            </div>

            {/* Stock Status */}
            <div className="mt-4">
              {isInStock ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600 font-medium">
                      In Stock
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.stock} available)
                  </span>
                  {isLowStock && (
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-300"
                    >
                      Low Stock
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-red-600 font-medium">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-muted-foreground">
                <p>{product.description}</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Actions */}
            <div className="mt-8 flex flex-col space-y-4">
              <div className="flex space-x-4">
                {/* <Button size="lg" className="flex-1" disabled={!isInStock}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button> */}
                <AddToCartButton productId={product.id} />
                {/* <Button size="lg" variant="outline" className="px-8"> */}
                {/* <WishlistButton productId={product.id} /> */}
                {/* </Button> */}
              </div>

              {!isInStock && (
                <Button variant="outline" size="lg" className="w-full">
                  Notify When Available
                </Button>
              )}
            </div>

            {/* Product Details */}
            <div className="mt-8 border-t pt-8">
              <h3 className="text-lg font-medium mb-4">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product ID:</span>
                  <span className="font-mono">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      product.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {product.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Added:</span>
                  <span>
                    {new Date(product.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
