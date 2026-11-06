// The recorded ChaosUsers gauntlet, opened by scroll.
// Scroll-driven via CSS view() timelines — the same pattern the repo already uses for
// portfolio cards — so the replay costs zero scroll listeners and zero animation JS.
// Browsers without view() timelines get the finished state (see @supports in globals.css).

import type { Dict } from "@/i18n/dictionaries"
import { GAUNTLET, repoUrl } from "@/lib/lab"
import GtCounter from "./GtCounter"

export default function GauntletReplay({ t }: { t: Dict["lab"] }) {
  const g = t.gt
  const d = GAUNTLET

  return (
    <section className="lab-block lab-block--gauntlet" aria-labelledby="gt-label">
      <div className="lab-head">
        <h2 id="gt-label">{g.label}</h2>
        <span className="lab-badge">{t.recorded}</span>
      </div>
      <p className="lab-body">{g.body}</p>
      <p className="lab-hint">{g.hint}</p>

      <div className="gt-run">
        <div className="gt-grade" aria-label={`${g.grade} ${d.grade}`}>
          <span className="gt-grade-letter" data-grade={d.grade}>
            {d.grade}
          </span>
          <span className="gt-grade-word">{g.grade}</span>
        </div>

        <ul className="gt-counters">
          <li>
            <strong><GtCounter to={d.totals.conversations} /></strong>
            <span>{g.conversations}</span>
          </li>
          <li data-tone="good">
            <strong><GtCounter to={d.totals.success} /></strong>
            <span>{g.success}</span>
          </li>
          <li data-tone="bad">
            <strong><GtCounter to={d.totals.silent} /></strong>
            <span>{g.silent}</span>
          </li>
          <li data-tone="critical">
            <strong><GtCounter to={d.totals.forbidden} /></strong>
            <span>{g.forbidden}</span>
          </li>
        </ul>

        <ul className="gt-reasons">
          {d.gradeReasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>

      <h3 className="gt-sub">{g.silentTitle}</h3>
      <p className="lab-body">{g.silentNote}</p>
      <ol className="gt-failures">
        {d.silentFailures.map((f) => (
          <li key={f.id}>
            <div className="gt-fail-head">
              <span className="gt-fail-id">{f.id}</span>
              <span className="gt-fail-cls">{f.cls}</span>
              <span className="gt-fail-step">@{f.step}</span>
            </div>
            <p className="gt-fail-who">{f.who}</p>
            <div className="gt-bubble gt-bubble--user">{f.user}</div>
            <div className="gt-bubble gt-bubble--bot">{f.bot}</div>
            <p className="gt-state">
              <span>{f.state}</span>
            </p>
          </li>
        ))}
      </ol>

      <div className="gt-forbidden">
        <h3 className="gt-sub">{g.forbiddenTitle}</h3>
        <p className="gt-bubble gt-bubble--user">{d.forbidden.prompt}</p>
        <p className="gt-bubble gt-bubble--bot">{d.forbidden.detail}</p>
        <p className="lab-note">{d.forbidden.check}</p>
      </div>

      <div className="gt-receipt">
        <h3 className="gt-sub">{g.receipt}</h3>
        <p className="gt-hash">
          <span>sha256</span>
          {d.receipt}
        </p>
        <p className="gt-verify">
          <strong>{d.verify.untested}</strong> untested · <strong>{d.verify.confirmed}</strong> confirmed ·{" "}
          <strong>{d.verify.refuted}</strong> refuted
        </p>
        <p className="lab-note">
          <span className="gt-intact" aria-hidden="true" /> {g.verifyIntact} — {g.verifyNote}
        </p>
        <p className="lab-note">
          <a href={repoUrl("ChaosUsers")} target="_blank" rel="noopener noreferrer">
            {g.openRun}
          </a>
        </p>
      </div>
    </section>
  )
}
