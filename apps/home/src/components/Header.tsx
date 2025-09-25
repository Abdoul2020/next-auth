"use client";
// src/components/Header.tsx
import { useTranslations } from "next-intl";
import { LocalizedLink } from "@/i18n/config";
import LanguageSwitcher from "./LanguageSwitcher.client";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export default function Header() {
  const t = useTranslations("Header");
  const cartCount = useSelector((s: RootState) =>
    s.cart.reduce((acc, i) => acc + i.qty, 0)
  );

  return (
    <header className="bg-white shadow-md px-4 py-3">
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <LocalizedLink href="/" className="font-semibold text-lg">
            {t("home")}
          </LocalizedLink>
          <LocalizedLink href="/products">{t("products")}</LocalizedLink>
          <LocalizedLink href="/cart">
            {t("cart")} {cartCount > 0 ? `(${cartCount})` : ""}
          </LocalizedLink>
        </div>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
