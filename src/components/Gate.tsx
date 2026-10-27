// Gate — the seal as a section divider. Gap at 60%. Left lit, right dark.
// A quiet reminder between sections: completion is earned, never faked.

export default function Gate() {
  return (
    <svg className="gate-divider" viewBox="0 0 520 8" aria-hidden="true" focusable="false">
      <line x1="0" y1="4" x2="300" y2="4" stroke="var(--pulse)" strokeWidth="3" />
      <line x1="316" y1="4" x2="520" y2="4" stroke="var(--edge)" strokeWidth="3" />
    </svg>
  )
}
