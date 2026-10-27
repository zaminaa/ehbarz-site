// /ask — the live terminal page. The mind, or its honest absence.

import { dict, LANGS, type Lang } from "@/i18n/dictionaries"
import SiteHeader from "@/components/SiteHeader"
import AskTerminal from "@/components/AskTerminal"
import Witness from "@/components/Witness"

const mainStyle = { paddingTop: "140px" } as const

export default async function AskPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const l = (LANGS.includes(lang as Lang) ? lang : "fa") as Lang
  const t = dict[l]

  return (
    <>
      <SiteHeader t={t} lang={l} path="ask" />
      <main id="content" className="monolith" style={mainStyle}>
        <AskTerminal t={t} lang={l} />
      </main>
      <Witness t={t} lang={l} />
    </>
  )
}
