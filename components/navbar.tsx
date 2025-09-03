import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Package, Badge } from "lucide-react";
import { cookieManager } from "@/utils/authTools";
import {
  MobileMenu,
  SearchForm,
  ThemeToggle,
  UserDropdown,
} from "./nav-client";
import { getCartItems } from "@/actions/cart";
import { getWishlistItems } from "@/actions/wishlist";
import { getOrders } from "@/actions/order";

export async function Navbar() {
  const user = await cookieManager.getAuthUser();
  const isAuthenticated = await cookieManager.isAuthenticated();
  const cartItems = await getCartItems();
  const wli = await getWishlistItems();
  const orders = await getOrders();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            E-Store
          </Link>

          {/* Search Bar - Desktop - Client Component */}
          <SearchForm />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle - Client Component */}
            <ThemeToggle />

            {/* Cart Icon with Count */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItems.count > 99 ? "99+" : cartItems.count}
                  </span>
                )}
              </Button>
            </Link>

            {/* Wishlist Icon with Count */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
                {wli.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center">
                    {wli.count > 99 ? "99+" : wli.count}
                  </span>
                )}
              </Button>
            </Link>

            {/* Orders Icon with Count */}
            <Link href="/orders">
              <Button variant="ghost" size="icon" className="relative">
                <Package className="w-5 h-5" />
                {orders.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center">
                    {orders.count > 99 ? "99+" : orders.count}
                  </span>
                )}
              </Button>
            </Link>

            {/* Authentication Section */}
            {isAuthenticated && user ? (
              <UserDropdown user={user} />
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu - Client Component (includes button and menu) */}

          <div className="md:hidden">
            <MobileMenu user={user} isAuthenticated={isAuthenticated} />
          </div>


        </div>
      </div>
    </nav>
  );
}
