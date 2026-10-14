"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function SkipLink() {
  const { t } = useLanguage();
  return <a href="#main-content" className="skip-link">{t("a11y.skip")}</a>;
}
