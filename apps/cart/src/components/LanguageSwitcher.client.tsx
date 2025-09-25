// src/components/LanguageSwitcher.client.tsx
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/config";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="inline-block">
      {["en", "tr"].map((loc) => (
        <button
          key={loc}
          className={`px-2 py-1 ml-2 rounded ${
            locale === loc ? "font-bold text-blue-600" : "text-gray-600"
          }`}
          onClick={() => switchLocale(loc)}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
