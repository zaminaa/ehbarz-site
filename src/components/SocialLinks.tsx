// SocialLinks — the doorways out of the monument. Mono type, no icons, no brand colors.
// Handles live in src/lib/social.ts (one file, edit there).

import { SOCIAL } from "@/lib/social"

export default function SocialLinks() {
  return (
    <nav className="social-row" aria-label="EHBARZ elsewhere">
      {SOCIAL.map((s) =>
        s.href.startsWith("mailto:") ? (
          <a key={s.id} href={s.href}>{s.label}</a>
        ) : (
          <a key={s.id} href={s.href} target="_blank" rel="me noopener noreferrer">{s.label}</a>
        ),
      )}
    </nav>
  )
}
