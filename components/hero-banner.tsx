"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroBanner() {
  return (
    <div className="relative h-[500px] bg-gradient-to-r from-gray-900 to-gray-600 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/placeholder.svg?height=500&width=1200"
          alt="Hero Banner"
          fill
          className="object-cover opacity-50"
        />
      </div>
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover Amazing Products</h1>
          <p className="text-xl mb-8">Shop the latest trends and find everything you need in one place</p>
          <div className="space-x-4">
            <Link href="/products">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                Shop Now
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
