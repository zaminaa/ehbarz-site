import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { dict, LANGS, type Lang } from "@/i18n/dictionaries"
import LangMemory from "@/components/LangMemory"
import "../globals.css"

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const t = dict[(lang as Lang) in dict ? (lang as Lang) : "fa"]
  return {
    title: t.siteTitle,
    description: t.siteDesc,
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!LANGS.includes(lang as Lang)) notFound()
  const l = lang as Lang
  const t = dict[l]

  return (
    <html lang={t.htmlLang} dir={t.dir}>
      <body>
        <a className="skip-link" href="#content">{t.skip}</a>
        {/* client-only: records the chosen voice in localStorage + cookie, inside useEffect */}
        <LangMemory lang={l} />
        {children}
      </body>
    </html>
  )
}
