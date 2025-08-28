import { ProductDetails } from "@/components/product-details";
import { getProductDetails } from "@/actions/products";

export default async function ProductDetailsPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductDetails(slug);

  return <ProductDetails product={product.data} />;
}
