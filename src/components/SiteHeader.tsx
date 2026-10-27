// SiteHeader — the fixed frame's top edge. Brand, nav, language switch.
// Server component: zero client JS for navigation.

import Link from "next/link"
import type { Dict, Lang } from "@/i18n/dictionaries"

export type SitePath = "" | "ask" | "forge" | "design"

export default function SiteHeader({ t, lang, path }: { t: Dict; lang: Lang; path: SitePath }) {
  const other: Lang = lang === "fa" ? "en" : "fa"
  const suffix = path ? `/${path}` : ""
  return (
    <header className="site-header">
      <Link className="brand" href={`/${lang}`} aria-label="EHBARZ">EHBARZ · اح‌بارز</Link>
      <nav aria-label="main">
        <Link href={`/${lang}`} aria-current={path === "" ? "page" : undefined}>{t.nav.home}</Link>
        <Link href={`/${lang}/ask`} aria-current={path === "ask" ? "page" : undefined}>{t.nav.ask}</Link>
        <Link href={`/${lang}/forge`} aria-current={path === "forge" ? "page" : undefined}>{t.nav.forge}</Link>
        <Link href={`/${lang}/design`} aria-current={path === "design" ? "page" : undefined}>{t.nav.design}</Link>
        <Link className="lang-switch" href={`/${other}${suffix}`} lang={other} hrefLang={other}>
          {other === "fa" ? "فارسی" : "EN"}
        </Link>
      </nav>
    </header>
  )
}
