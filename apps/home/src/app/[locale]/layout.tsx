import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";
import { getMessages } from "next-intl/server";

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "tr" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await import(`../../messages/${locale}.json`).then(
    (m) => m.default
  );

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
