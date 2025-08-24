// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Label } from "@/components/ui/label"
// import { Slider } from "@/components/ui/slider"
// import { useProductStore } from "@/stores/product-store"

// const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Beauty"]

// export function ProductFilters() {
//   const { filters, setFilters, clearFilters } = useProductStore()
//   const [priceRange, setPriceRange] = useState([0, 1000])

//   const handleCategoryChange = (category: string, checked: boolean) => {
//     const newCategories = checked ? [...filters.categories, category] : filters.categories.filter((c) => c !== category)

//     setFilters({ ...filters, categories: newCategories })
//   }

//   const handlePriceChange = (value: number[]) => {
//     setPriceRange(value)
//     setFilters({ ...filters, priceRange: value })
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg">Filters</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div>
//             <h3 className="font-medium mb-3">Categories</h3>
//             <div className="space-y-2">
//               {categories.map((category) => (
//                 <div key={category} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={category}
//                     checked={filters.categories.includes(category)}
//                     onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
//                   />
//                   <Label htmlFor={category} className="text-sm">
//                     {category}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div>
//             <h3 className="font-medium mb-3">Price Range</h3>
//             <div className="px-2">
//               <Slider value={priceRange} onValueChange={handlePriceChange} max={1000} step={10} className="mb-2" />
//               <div className="flex justify-between text-sm text-muted-foreground">
//                 <span>${priceRange[0]}</span>
//                 <span>${priceRange[1]}</span>
//               </div>
//             </div>
//           </div>

//           <div>
//             <h3 className="font-medium mb-3">Availability</h3>
//             <div className="space-y-2">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="inStock"
//                   checked={filters.inStock}
//                   onCheckedChange={(checked) => setFilters({ ...filters, inStock: checked as boolean })}
//                 />
//                 <Label htmlFor="inStock" className="text-sm">
//                   In Stock
//                 </Label>
//               </div>
//             </div>
//           </div>

//           <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
//             Clear Filters
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
