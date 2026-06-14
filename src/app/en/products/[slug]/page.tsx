import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/pages/ProductDetailPage";
import { getProductBySlug, products } from "@/content/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slugs.en }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug("en", slug);

  return {
    title: product?.name.en ?? "Product",
    description: product?.summary.en,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug("en", slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailPage locale="en" product={product} />;
}
