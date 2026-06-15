import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/pages/ProductDetailPage";
import { products } from "@/content/products";
import { getDeckPageData } from "@/lib/data/deck";
import { getProductBySlug } from "@/lib/data/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slugs.en }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug("en", slug);

  return {
    title: product?.name.en ?? "Product",
    description: product?.summary.en,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [deckData, product] = await Promise.all([
    getDeckPageData("en", "products"),
    getProductBySlug("en", slug),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductDetailPage deckData={deckData} locale="en" product={product} />;
}
