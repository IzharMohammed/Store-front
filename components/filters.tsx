"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ProductsFilter({ categories = [] as string[] }: { categories?: string[] } = { categories: [] }) {
  const router = useRouter()
  const params = useSearchParams()

  const [category, setCategory] = useState(params.get("category") ?? "all")
  const [sort, setSort] = useState(params.get("sort") ?? "relevance")
  const [min, setMin] = useState(Number(params.get("min") ?? 0))
  const [max, setMax] = useState(Number(params.get("max") ?? 1000))

  useEffect(() => {
    setCategory(params.get("category") ?? "all")
    setSort(params.get("sort") ?? "relevance")
    setMin(Number(params.get("min") ?? 0))
    setMax(Number(params.get("max") ?? 1000))
  }, [params])

  function apply() {
    const next = new URLSearchParams(params.toString())
    if (category && category !== "all") next.set("category", category)
    else next.delete("category")
    next.set("sort", sort)
    next.set("min", String(min))
    next.set("max", String(max))
    router.push(`/products?${next.toString()}`)
  }

  function reset() {
    router.push("/products")
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <ScrollArea className="max-h-56">
                <div className="p-1">
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </div>
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Price range</Label>
          <div className="flex items-center gap-3">
            <Slider
              defaultValue={[min, max]}
              min={0}
              max={2000}
              step={10}
              onValueChange={(vals) => {
                setMin(vals[0] ?? 0)
                setMax(vals[1] ?? 1000)
              }}
            />
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              ${min} - ${max}
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="sort">Sort</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger id="sort" className="w-full">
              <SelectValue placeholder="Relevance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button onClick={apply}>Apply</Button>
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  )
}
