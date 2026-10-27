// The monument — Hero → living graph → chambers → the constitution → the gate.
// Server component shell; only the living organs are client components.

import { dict, LANGS, type Lang } from "@/i18n/dictionaries"
import SiteHeader from "@/components/SiteHeader"
import Hero from "@/components/Hero"
import VeinGraph from "@/components/VeinGraph"
import ChamberGrid from "@/components/ChamberGrid"
import Gate from "@/components/Gate"
import Witness from "@/components/Witness"

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const l = (LANGS.includes(lang as Lang) ? lang : "fa") as Lang
  const t = dict[l]

  return (
    <>
      <SiteHeader t={t} lang={l} path="" />
      <main id="content">
        <Hero t={t} lang={l} />
        <VeinGraph t={t} lang={l} />
        <Gate />
        <ChamberGrid t={t} lang={l} />
        <Gate />
        <section className="monolith" aria-labelledby="laws-label">
          <span className="section-label" id="laws-label">{t.laws.label}</span>
          <ol className="laws-list">
            {t.laws.items.map((law) => (
              <li key={law}>{law}</li>
            ))}
          </ol>
        </section>
      </main>
      <Witness t={t} lang={l} />
    </>
  )
}
