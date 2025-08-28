import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Package } from "lucide-react";
import { cookieManager } from "@/utils/authTools"; // Update with correct path
import { MobileMenu, SearchForm, ThemeToggle, UserDropdown } from "./nav-client";


export async function Navbar() {
  // Get user data server-side
  const user = await cookieManager.getAuthUser();
  const isAuthenticated = await cookieManager.isAuthenticated();

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

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {/* {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getTotalItems()}
                  </Badge>
                )} */}
              </Button>
            </Link>

            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
                {/* {wishlistItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {wishlistItems.length}
                  </Badge>
                )} */}
              </Button>
            </Link>

            <Link href="/orders">
              <Button variant="ghost" size="icon" className="relative">
                <Package className="w-5 h-5" />
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
          <MobileMenu
            user={user}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </nav>
  );
}
