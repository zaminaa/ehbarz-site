// /lab — the live lab notebook. Three blocks, each labelled with what it really is:
// a sample dataset, a recorded run, or a live API read. Nothing here is a claim.

import { dict, LANGS, type Lang } from "@/i18n/dictionaries"
import SiteHeader from "@/components/SiteHeader"
import Witness from "@/components/Witness"
import StackWeightDemo from "@/components/lab/StackWeightDemo"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = dict[(lang as Lang) in dict ? (lang as Lang) : "fa"]
  return { title: `${t.lab.title} — ${t.siteTitle}`, description: t.lab.lede }
}

export default async function LabPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const l = (LANGS.includes(lang as Lang) ? lang : "fa") as Lang
  const t = dict[l]

  return (
    <>
      <SiteHeader t={t} lang={l} path="lab" />
      <main id="content" className="lab">
        <header className="lab-hero">
          <p className="lab-kicker">{t.lab.kicker}</p>
          <h1>{t.lab.title}</h1>
          <p className="lab-lede">{t.lab.lede}</p>
          <hr className="hero-rule" />
        </header>
        <StackWeightDemo t={t.lab} />
        <section className="lab-block" aria-labelledby="gt-label">
          <div className="lab-head">
            <h2 id="gt-label">{t.lab.gt.label}</h2>
            <span className="lab-badge">{t.lab.recorded}</span>
          </div>
          <p className="lab-body">{t.lab.gt.body}</p>
        </section>
        <section className="lab-block" aria-labelledby="journal-label">
          <div className="lab-head">
            <h2 id="journal-label">{t.lab.journal.label}</h2>
          </div>
          <p className="lab-body">{t.lab.journal.body}</p>
        </section>
      </main>
      <Witness t={t} lang={l} />
    </>
  )
}
