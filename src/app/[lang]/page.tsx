// Homepage — the approved introduction and six system cards.
// Status lines and chips are slices of that same copy, not new sentences.

import { dict, LANGS, type Lang } from "@/i18n/dictionaries"
import SiteHeader from "@/components/SiteHeader"
import SocialLinks from "@/components/SocialLinks"

const STATUS_TAILS = [
  " نه قالب آماده.",
  " Not a ready-made template.",
  " اتصال نهایی به بانک مادر هنوز در مرحلهٔ ساخت است.",
  " The final connection to the parent bank is still under construction.",
]

function cardParts(body: string) {
  for (const mark of [" وضعیت: ", " Status: "]) {
    const at = body.indexOf(mark)
    if (at !== -1) return { text: body.slice(0, at), status: body.slice(at + 1) }
  }
  for (const tail of STATUS_TAILS) {
    if (body.endsWith(tail)) return { text: body.slice(0, -tail.length).trimEnd(), status: tail.trim() }
  }
  return { text: body, status: "" }
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const l = (LANGS.includes(lang as Lang) ? lang : "fa") as Lang
  const t = dict[l]

  return (
    <>
      <SiteHeader t={t} lang={l} path="" />
      <main id="content">
        <header className="home-hero">
          <h1>{t.home.title}</h1>
          {t.home.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </header>
        <section className="glance" aria-label={t.home.glanceLabel}>
          <h2 className="home-title">{t.home.glanceLabel}</h2>
          <ul>
            {t.home.glance.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="monolith portfolio" aria-labelledby="portfolio-label">
          <h2 className="home-title" id="portfolio-label">{t.home.portfolioLabel}</h2>
          <div className="portfolio-grid">
            {t.portfolio.map((item) => {
              const { text, status } = cardParts(item.body)
              return (
                <article className="portfolio-card" key={item.title}>
                  <div className="card-face">
                    <h3>{item.title}</h3>
                    <p>{text}</p>
                    {item.tech.length > 0 && (
                      <ul className="chips">
                        {item.tech.map((chip) => (
                          <li key={chip}>{chip}</li>
                        ))}
                      </ul>
                    )}
                    {status && <p className="card-status">{status}</p>}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>
      <footer className="witness-footer">
        <SocialLinks />
      </footer>
    </>
  )
}
