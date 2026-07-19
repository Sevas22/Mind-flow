"use client"

import * as React from "react"

import { defaultLocale, type Locale } from "@/lib/i18n"

const STORAGE_KEY = "mindflow-locale"

const LanguageContext = React.createContext<{
  locale: Locale
  setLocale: (locale: Locale) => void
}>({
  locale: defaultLocale,
  setLocale: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(defaultLocale)

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "es" || stored === "en" || stored === "pt") {
      setLocaleState(stored)
    }
  }, [])

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return React.useContext(LanguageContext)
}
