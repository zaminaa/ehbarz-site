// social.ts — the doorways out of the monument. One registry, used by SocialLinks.
// As-built honesty: these are the handles as configured today — edit HERE (one file)
// if a handle changes. No icons, no brand colors: mono type, like everything else.

export type SocialLink = {
  id: string
  label: string
  href: string
}

export const SOCIAL: SocialLink[] = [
  { id: "github", label: "GitHub", href: "https://github.com/ehbarz" },
  { id: "instagram", label: "Instagram", href: "https://instagram.com/ehbarz" },
  { id: "telegram", label: "Telegram", href: "https://t.me/ehbarz" },
  { id: "email", label: "Email", href: "mailto:barzaminie@gmail.com" },
]
