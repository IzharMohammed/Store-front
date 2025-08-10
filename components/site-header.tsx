"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ShoppingCart, Heart, User, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useEffect, useMemo, useState } from "react"

export function SiteHeader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get("q") ?? "")

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "")
  }, [searchParams])

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query) params.set("q", query)
    else params.delete("q")
    router.push(`/products?${params.toString()}`)
  }

  const navItems = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/products", label: "Products" },
      { href: "/orders", label: "My Orders" },
    ],
    [],
  )

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>Shop</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 grid gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded px-3 py-2 text-sm ${
                      pathname === item.href ? "bg-muted font-medium" : "hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 grid gap-2">
                <Link href="/login" className="rounded px-3 py-2 text-sm hover:bg-muted inline-flex items-center gap-2">
                  <User className="h-4 w-4" /> Login
                </Link>
                <Link
                  href="/wishlist"
                  className="rounded px-3 py-2 text-sm hover:bg-muted inline-flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" /> Wishlist
                </Link>
                <Link href="/cart" className="rounded px-3 py-2 text-sm hover:bg-muted inline-flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" /> Cart
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="text-base font-semibold tracking-tight">
            Shop
          </Link>
        </div>

        <form onSubmit={onSearch} className="ml-auto hidden flex-1 items-center md:flex md:max-w-md">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="pl-8"
              aria-label="Search products"
            />
          </div>
        </form>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          <Link href="/login">
            <Button variant="ghost" size="icon" aria-label="Login">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="px-4 pb-3 md:hidden">
        <form onSubmit={onSearch} className="mx-auto max-w-6xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="pl-8"
              aria-label="Search products"
            />
          </div>
        </form>
      </div>
    </header>
  )
}
