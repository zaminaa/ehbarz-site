// Homepage — approved copy, laid out as a single-page portfolio.
// The status pill and the details list are slices of that same copy.

import { dict, LANGS, type Lang } from "@/i18n/dictionaries"
import SiteHeader from "@/components/SiteHeader"
import SocialLinks from "@/components/SocialLinks"

const NUMS = {
  fa: ["۰۱", "۰۲", "۰۳", "۰۴", "۰۵", "۰۶"],
  en: ["01", "02", "03", "04", "05", "06"],
} as const

const STATUS_TAILS = [
  " نه قالب آماده.",
  " Not a ready-made template.",
  " اتصال نهایی به بانک مادر هنوز در مرحلهٔ ساخت است.",
  " The final connection to the parent bank is still under construction.",
]

function statusLine(body: string) {
  for (const mark of [" وضعیت: ", " Status: "]) {
    const at = body.indexOf(mark)
    if (at !== -1) return body.slice(at + 1)
  }
  for (const tail of STATUS_TAILS) {
    if (body.endsWith(tail)) return tail.trim()
  }
  return ""
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
          <hr className="hero-rule" />
        </header>
        <section className="glance" aria-label={t.home.glanceLabel}>
          <h2 className="home-title">{t.home.glanceLabel}</h2>
          <ul className="stat-grid">
            {t.home.glance.map((item) => (
              <li key={item.value}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="monolith portfolio" aria-labelledby="portfolio-label">
          <h2 className="home-title" id="portfolio-label">{t.home.portfolioLabel}</h2>
          <div className="portfolio-grid">
            {t.portfolio.map((item, i) => {
              const status = statusLine(item.body)
              return (
                <article className="portfolio-card" key={item.title}>
                  <div className="card-face">
                    <span className="card-num">{NUMS[l][i]}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    {item.tech.length > 0 && (
                      <ul className="chips">
                        {item.tech.map((chip) => (
                          <li key={chip}>{chip}</li>
                        ))}
                      </ul>
                    )}
                    {status && <p className="card-status">{status}</p>}
                    <details className="card-more">
                      <summary>{t.home.details}</summary>
                      <ul>
                        {item.proof.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </details>
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
