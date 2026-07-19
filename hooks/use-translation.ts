"use client"

import { useLanguage } from "@/components/language-provider"
import { dictionaries } from "@/lib/i18n"

export function useTranslation() {
  const { locale, setLocale } = useLanguage()
  return { t: dictionaries[locale], locale, setLocale }
}
