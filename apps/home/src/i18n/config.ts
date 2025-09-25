// src/i18n/config.ts
import { createNavigation } from "next-intl/navigation";
export { useLocale } from "next-intl";

export const locales = ["en", "tr"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "EN",
  tr: "TR",
};

export const {
  Link: LocalizedLink,
  usePathname,
  useRouter,
  redirect,
  getPathname,
} = createNavigation({ locales });
