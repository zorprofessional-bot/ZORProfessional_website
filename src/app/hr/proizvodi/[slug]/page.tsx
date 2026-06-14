import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/pages/ProductDetailPage";
import { getProductBySlug, products } from "@/content/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slugs.hr }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug("hr", slug);

  return {
    title: product?.name.hr ?? "Proizvod",
    description: product?.summary.hr,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug("hr", slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailPage locale="hr" product={product} />;
}
