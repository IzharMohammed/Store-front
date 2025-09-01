"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

export function CategoryFilter() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategorySelect = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if(category === "all"){
      router.push("/products");
    }else{
      params.set("category", category);
    }
    router.push(`/products?${params.toString()}`);

  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Filter</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleCategorySelect("all")}>All</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCategorySelect("Electronics")}>Electronics</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCategorySelect("Clothing")}>Clothing</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCategorySelect("Home and garden")}>Home and garden</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCategorySelect("Sports")}>Sports</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCategorySelect("Books")}>Books</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCategorySelect("Beauty")}>Beauty</DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}