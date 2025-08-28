import { ProductDetails } from "@/components/product-details";
import { getProductDetails } from "@/actions/products";

export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {

  const product = await getProductDetails(params.slug);

  return <ProductDetails product={product.data} />;
}
