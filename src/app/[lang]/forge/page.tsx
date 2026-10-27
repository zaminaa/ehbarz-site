// /forge — کورهٔ تصمیم · the decision forge.
// The confidence gate made personal: the surprise organ of V13.9.9.

import { dict, LANGS, type Lang } from "@/i18n/dictionaries"
import SiteHeader from "@/components/SiteHeader"
import Forge from "@/components/Forge"
import Witness from "@/components/Witness"

const mainStyle = { paddingTop: "140px" } as const

export default async function ForgePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const l = (LANGS.includes(lang as Lang) ? lang : "fa") as Lang
  const t = dict[l]

  return (
    <>
      <SiteHeader t={t} lang={l} path="forge" />
      <main id="content" className="monolith" style={mainStyle}>
        <Forge t={t} lang={l} />
      </main>
      <Witness t={t} lang={l} />
    </>
  )
}
