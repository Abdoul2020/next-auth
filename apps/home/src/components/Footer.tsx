// src/components/Footer.tsx
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="bg-gray-100 mt-12 py-6">
      <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
        {t("copyright")}
      </div>
    </footer>
  );
}