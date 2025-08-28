import { Product } from "@/types/index";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { getPaginatedProducts } from "@/actions/products";
import ProductError from "./error";
import Link from "next/link";
import { CategoryFilter } from "@/components/CategoryFilter";


export default async function ProductsPage(props: {
  searchParams?: Promise<{ page?: string; category?: string }>
}) {

  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page ?? 1);
  const category = searchParams?.category ?? "";
  const LIMIT = 16;


  const res = await getPaginatedProducts(page, LIMIT, category);
  // console.log("data of paginated", res);

  if (!res?.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProductError error={new Error(res?.error || "Failed")} reset={() => { }} />
      </div>
    );
  }

  const { items: products, totalProducts } = res;
  const totalPages = Math.ceil(totalProducts / LIMIT);

  return (
    <div className="container mx-auto px-20 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
          <CategoryFilter />
      </div>


      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No products found..
            <Link href="/">
              <Button className="mt-4">Go back</Button>
            </Link>
          </div>
        )}
      </div>


      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 mt-6">
        {/* Prev */}
        <Button asChild disabled={page === 1}>
          <Link href={`?page=${page - 1}`}>Prev</Link>
        </Button>

        {/* Always show first page */}
        {page > 3 && (
          <>
            <Button asChild variant={page === 1 ? "default" : "outline"}>
              <Link href="?page=1">1</Link>
            </Button>
            {page > 4 && <span className="px-2">...</span>}
          </>
        )}

        {/* Middle range */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((num) => num >= page - 2 && num <= page + 2)
          .map((num) => (
            <Button
              key={num}
              asChild
              variant={num === page ? "default" : "outline"}
            >
              <Link href={`?page=${num}`}>{num}</Link>
            </Button>
          ))}

        {page < totalPages - 2 && (
          <>
            {page < totalPages - 3 && <span className="px-2">...</span>}
            <Button asChild variant={page === totalPages ? "default" : "outline"}>
              <Link href={`?page=${totalPages}`}>{totalPages}</Link>
            </Button>
          </>
        )}

        {/* Next */}
        <Button asChild disabled={page === totalPages}>
          <Link href={`?page=${page + 1}`}>Next</Link>
        </Button>
      </div>
    </div>
  );
}
