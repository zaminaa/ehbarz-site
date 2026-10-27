// SiteHeader — the fixed frame's top edge. Brand, nav, language switch.
// Server component: zero client JS for navigation.

import Link from "next/link"
import type { Dict, Lang } from "@/i18n/dictionaries"
import ThemeToggle from "./ThemeToggle"

export type SitePath = "" | "ask"

export default function SiteHeader({ t, lang, path }: { t: Dict; lang: Lang; path: SitePath }) {
  const other: Lang = lang === "fa" ? "en" : "fa"
  const suffix = path ? `/${path}` : ""
  return (
    <header className="site-header">
      <Link className="brand" href={`/${lang}`} aria-label="EHBARZ">EHBARZ · اح‌بارز</Link>
      <nav aria-label="main">
        <Link href={`/${lang}`} aria-current={path === "" ? "page" : undefined}>{t.nav.home}</Link>
        <ThemeToggle t={t} />
        <Link className="lang-switch" href={`/${other}${suffix}`} lang={other} hrefLang={other}>
          {other === "fa" ? "فارسی" : "EN"}
        </Link>
      </nav>
    </header>
  )
}
