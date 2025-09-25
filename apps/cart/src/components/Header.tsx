"use client";
// src/components/Header.tsx
import { useTranslations } from "next-intl";
import { LocalizedLink } from "@/i18n/config";
import LanguageSwitcher from "./LanguageSwitcher.client";
import { useState, useEffect } from "react";

export default function Header() {
  const t = useTranslations("Header");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Read cart count from localStorage
    const updateCartCount = () => {
      try {
        const raw = localStorage.getItem("microcart");
        if (raw) {
          const cart = JSON.parse(raw);
          const count = cart.reduce((acc: number, item: any) => acc + item.qty, 0);
          setCartCount(count);
        }
      } catch (e) {
        setCartCount(0);
      }
    };

    updateCartCount();

    // Listen for cart updates
    const bc = new BroadcastChannel("microcart");
    bc.onmessage = () => updateCartCount();
    
    const onStorage = () => updateCartCount();
    window.addEventListener("storage", onStorage);

    return () => {
      bc.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

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
