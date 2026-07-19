import { es } from "./es"
import { en } from "./en"
import { pt } from "./pt"
import type { Locale, Dictionary } from "./types"

export const dictionaries: Record<Locale, Dictionary> = { es, en, pt }
export const locales: Locale[] = ["es", "en", "pt"]
export const localeLabels: Record<Locale, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
}
export const defaultLocale: Locale = "es"

export type { Locale, Dictionary }
