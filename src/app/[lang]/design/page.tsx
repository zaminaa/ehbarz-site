// Design System — embedded, as-built. This page is made of the tokens it documents.
// V13.9.9: five tokens. The fifth is heat, and heat is rationed to 2% of any frame.

import { dict, LANGS, type Lang } from "@/i18n/dictionaries"
import SiteHeader from "@/components/SiteHeader"
import Gate from "@/components/Gate"
import Witness from "@/components/Witness"

const TOKENS = [
  { name: "--void", hex: "#060607", roleFa: "فضا · دست‌کم ۸۰٪ هر قاب", roleEn: "space · ≥80% of every frame" },
  { name: "--carbon", hex: "#131316", roleFa: "سطوح و دیوارهٔ حفره‌ها", roleEn: "surfaces · chamber walls" },
  { name: "--bone", hex: "#E7E4DC", roleFa: "تایپ · هرگز سفید خالص نیست", roleEn: "typography · never pure white" },
  { name: "--pulse", hex: "#F4F2EC", roleFa: "نور درون رگ", roleEn: "the light inside the vein" },
  { name: "--ember", hex: "#E8621C", roleFa: "فقط در لحظهٔ تصمیم · ≤۲٪ هر قاب · هرگز شعله", roleEn: "commit only · ≤2% of any frame · never flames" },
]

const mainStyle = { paddingTop: "80px" } as const
const h1Style = { fontSize: "clamp(2rem, 5vw, 3.2rem)", marginBottom: "56px" } as const
const blockStyle = { marginBottom: "64px" } as const
const faBigStyle = { marginTop: "8px" } as const
const voiceStyle = { fontSize: "1.15rem", maxWidth: "38em" } as const
const captionStyle = { marginTop: "10px" } as const
const preStyle = { border: "1px solid var(--edge)", padding: "24px", overflowX: "auto", lineHeight: 1.9, direction: "ltr" } as const

// epistemic luminance bars · the 4th row is the one heat state: ember, full, brief
const LUM_BARS = [
  { width: "100%", ember: false },
  { width: "40%", ember: false },
  { width: "0%", ember: false },
  { width: "100%", ember: true },
]

export default async function DesignPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const l = (LANGS.includes(lang as Lang) ? lang : "fa") as Lang
  const t = dict[l]

  return (
    <>
      <SiteHeader t={t} lang={l} path="design" />
      <main id="content" style={mainStyle}>
        <section className="monolith" aria-labelledby="ds-title">
          <h1 className="monument monument-native" id="ds-title" style={h1Style}>
            {t.design.title}
          </h1>

          <span className="section-label">{t.design.palette}</span>
          <div className="tokens-grid">
            {TOKENS.map((tok) => {
              const swatchStyle = { background: tok.hex }
              return (
                <div className="token-cell" key={tok.name}>
                  <div className="swatch" style={swatchStyle} />
                  <span className="witness"><strong>{tok.name}</strong> · {tok.hex}</span>
                  <span className="witness">{l === "fa" ? tok.roleFa : tok.roleEn}</span>
                </div>
              )
            })}
          </div>

          <span className="section-label">{t.design.luminance}</span>
          <div style={blockStyle}>
            {t.design.lumRows.map((row, i) => {
              const bar = LUM_BARS[i] ?? LUM_BARS[2]
              const barStyle = { width: bar.width }
              return (
                <div className="lum-row" key={row}>
                  <span className="lum-bar" aria-hidden="true"><i className={bar.ember ? "ember" : undefined} style={barStyle} /></span>
                  <span className="witness">{row}</span>
                </div>
              )
            })}
          </div>

          <span className="section-label">{t.design.motion}</span>
          <div style={blockStyle}>
            {t.design.motionRows.map((row) => (
              <div className="lum-row" key={row}>
                <span className="witness">{row}</span>
              </div>
            ))}
          </div>

          <span className="section-label">{t.design.type}</span>
          <div style={blockStyle}>
            <div className="type-specimen">
              <div className="monument big">EHBARZ</div>
              <div className="monument monument-native big" style={faBigStyle} lang="fa" dir="rtl">اح‌بارز</div>
              <p className="witness" style={captionStyle}>Monument · Monument Extended / Estedad Black</p>
            </div>
            <div className="type-specimen">
              <p style={voiceStyle}>{t.hero.statement}</p>
              <p className="witness" style={captionStyle}>Voice · Inter / Estedad</p>
            </div>
            <div className="type-specimen">
              <p className="witness">confidence 87 · اطمینان ۸۷٪ · uptime live-or-absent · JetBrains Mono</p>
              <p className="witness" style={captionStyle}>Witness · JetBrains Mono + Persian digits</p>
            </div>
          </div>

          <Gate />

          <span className="section-label">{t.design.asBuilt}</span>
          <p className="section-intro">{t.design.asBuiltNote}</p>
          <pre className="witness" style={preStyle}>
{`--void:#060607  --carbon:#131316  --bone:#E7E4DC  --pulse:#F4F2EC  --ember:#E8621C
--ease-resolve: cubic-bezier(.7,0,.16,1)   --resolve-t: 1300ms   hesitation: 0.90
--ease-still:   cubic-bezier(.16,1,.3,1)   THE WAIT: 0.5Hz       THE COMMIT: 280ms · once
THE SMOLDER: 0.2Hz · only 01–06 Asia/Tehran · only the ember point
veins: 0°/45°/90° · 2px · fillet 8px · max 7 lit chambers + ONE decision chamber · ≥80% void
heat law: heat = commitment, not confidence · ember share ≤ 2% of any frame · never flames
molten gradient: exactly ONE · the final approach into engine.decision · userSpaceOnUse
wordmark fill = live mean confidence · cap 0.98 · the unfinished 2% holds the ember point
gate: 60 · below it → «نمی‌دانم» rendered with dignity · nothing below it can get hot`}
          </pre>
        </section>
      </main>
      <Witness t={t} lang={l} />
    </>
  )
}
