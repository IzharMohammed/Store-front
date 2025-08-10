"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"

const banners = [
  {
    id: "b1",
    title: "New Arrivals",
    href: "/products?sort=new",
    src: "/placeholder-xek0s.png",
  },
  {
    id: "b2",
    title: "Minimal Home Goods",
    href: "/products?category=Home",
    src: "/minimal-home-banner.png",
  },
  {
    id: "b3",
    title: "Essentials Sale",
    href: "/products?sort=price-asc",
    src: "/minimal-sale-banner.png",
  },
]

export function BannerCarousel() {
  const [index, setIndex] = useState(0)

  function prev() {
    setIndex((i) => (i - 1 + banners.length) % banners.length)
  }
  function next() {
    setIndex((i) => (i + 1) % banners.length)
  }

  const b = banners[index]
  return (
    <div className="relative rounded-lg overflow-hidden border">
      <Link href={b.href} className="block">
        <Image
          src={b.src || "/placeholder.svg"}
          alt={b.title}
          width={1200}
          height={320}
          className="w-full h-44 sm:h-60 md:h-72 object-cover"
        />
      </Link>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/40 to-transparent" />
      <div className="absolute inset-y-0 left-0 flex items-center">
        <Button variant="ghost" size="icon" onClick={prev} aria-label="Previous" className="ml-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <Button variant="ghost" size="icon" onClick={next} aria-label="Next" className="mr-2">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
