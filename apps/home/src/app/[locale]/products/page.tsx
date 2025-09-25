// src/app/[locale]/products/page.tsx

import ProductsList from "@/components/ProductsList.client";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
};

// optional top-level revalidation
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Header" });
  return {
    title: t("products listing"),
    description: `Browse products in ${t("products")}`
  };
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  // fetch products here
  const res = await fetch("https://fakestoreapi.com/products", {
    next: { revalidate: 60 }
  });
  const products: Product[] = await res.json();

  // load translations
  const t = await getTranslations({ locale, namespace: "Header" });

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t("products")}</h1>
      <ProductsList products={products} />
    </main>
  );
}
