// Homepage — the approved introduction and the six systems.
// Server component. The theme toggle lives in the header.

import { dict, LANGS, type Lang } from "@/i18n/dictionaries"
import SiteHeader from "@/components/SiteHeader"
import SocialLinks from "@/components/SocialLinks"

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
          <span className="section-label">{t.home.glanceLabel}</span>
          <ul>
            {t.home.glance.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="monolith portfolio" aria-labelledby="portfolio-label">
          <span className="section-label" id="portfolio-label">{t.home.portfolioLabel}</span>
          {t.portfolio.map((item) => (
            <article key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </section>
      </main>
      <footer className="witness-footer">
        <SocialLinks />
      </footer>
    </>
  )
}
