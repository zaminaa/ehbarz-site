// systems.ts — the as-built registry. One entry per real system.
// The graph, the chambers, and /api/status all read from this single source of truth.
// Laws: max 7 lit chambers per frame, plus the ONE ember-framed decision chamber.
// ChromaDB is quarantined by design. engine.decision is the only chamber allowed heat.

export type SystemDef = {
  id: string
  /** env var suffix probed by /api/status — e.g. IRANOBAN → STATUS_URL_IRANOBAN */
  envKey?: string
  quarantined?: boolean
  /** the one ember-framed chamber — deciding is heat */
  decision?: boolean
  nameFa: string
  nameEn: string
  descFa: string
  descEn: string
  stack: string[]
  /** node geometry inside the VeinGraph viewBox (1200×560), 8px module, 0/45/90 only */
  node: { x: number; y: number; w: number; h: number }
}

export const SYSTEMS: SystemDef[] = [
  {
    id: "core",
    envKey: "CORE",
    nameFa: "هسته · ارکستر n8n",
    nameEn: "core · n8n orchestrator",
    descFa: "قلب تپندهٔ اتوماسیون. هر جریان کاری از این حفره می‌گذرد؛ اگر اینجا تاریک شود، ذهن در سکوت است.",
    descEn: "The beating heart of automation. Every workflow passes through this chamber; when it goes dark, the mind is silent.",
    stack: ["n8n", "webhooks", "cron"],
    node: { x: 480, y: 228, w: 120, h: 64 },
  },
  {
    id: "engine.decision",
    envKey: "DECISION",
    decision: true,
    nameFa: "موتور تصمیم · تنها حفرهٔ اخگرنشان",
    nameEn: "engine.decision · the only ember-framed chamber",
    descFa: "جایی که ذهن تعهد می‌دهد. آخرین تکهٔ رگِ ورودی‌اش مذاب است — چون تصمیم یعنی گرما، و گرما فقط بالای دروازهٔ ۶۰ زنده است.",
    descEn: "Where the mind commits. The last stretch of its incoming vein runs molten — because deciding is heat, and heat lives only above the gate of 60.",
    stack: ["gate:60", "commit:280ms", "ember≤2%"],
    node: { x: 660, y: 98, w: 180, h: 64 },
  },
  {
    id: "iranoban",
    envKey: "IRANOBAN",
    nameFa: "ایرانوبان",
    nameEn: "Iranoban",
    descFa: "سامانهٔ پایش زنده. چشمی که نمی‌خوابد؛ وقتی سازنده خواب است، آهسته‌تر می‌بیند اما می‌بیند.",
    descEn: "The live monitoring system. An eye that does not sleep; while the maker sleeps it watches slower, but it watches.",
    stack: ["monitoring", "alerts", "telemetry"],
    node: { x: 210, y: 228, w: 150, h: 64 },
  },
  {
    id: "javdan",
    envKey: "JAVDAN",
    nameFa: "جاودان",
    nameEn: "Javdan",
    descFa: "لایهٔ ماندگاری. آنچه ارزش نگه‌داشتن دارد، اینجا سنگ می‌شود.",
    descEn: "The permanence layer. What deserves to be kept is set in stone here.",
    stack: ["archive", "storage"],
    node: { x: 210, y: 100, w: 150, h: 64 },
  },
  {
    id: "ask",
    envKey: "ASK",
    nameFa: "‎/ask · ترمینال زنده",
    nameEn: "/ask · the live terminal",
    descFa: "دریچهٔ گفت‌وگو با ذهن. زیر دروازهٔ اطمینان ۶۰، پاسخ نمی‌دهد — و همین شرف اوست.",
    descEn: "The doorway for talking to the mind. Below the confidence gate of 60 it refuses to answer — that refusal is its honor.",
    stack: ["agent", "LLM", "gate:60"],
    node: { x: 910, y: 168, w: 120, h: 64 },
  },
  {
    id: "db",
    envKey: "DB",
    nameFa: "دفتر کل · db",
    nameEn: "db · the ledger",
    descFa: "حقیقت ثبت‌شده. رکوردها دروغ نمی‌گویند.",
    descEn: "Recorded truth. Rows do not lie.",
    stack: ["PostgreSQL", "SQLite"],
    node: { x: 700, y: 388, w: 120, h: 64 },
  },
  {
    id: "topics_memory",
    envKey: "TOPICS_MEMORY",
    nameFa: "حافظهٔ موضوعات",
    nameEn: "topics_memory",
    descFa: "آنچه ذهن از گفت‌وگوها نگه می‌دارد. حافظه امانت است، نه غنیمت.",
    descEn: "What the mind keeps from its conversations. Memory is a trust, not a trophy.",
    stack: ["embeddings", "recall"],
    node: { x: 950, y: 388, w: 190, h: 64 },
  },
  {
    id: "chromadb",
    quarantined: true,
    nameFa: "ChromaDB · قرنطینه",
    nameEn: "ChromaDB · quarantined",
    descFa: "آن‌سوی فاصلهٔ هوا. هیچ رگی از این شکاف نمی‌گذرد — این زخم نیست، تصمیم است.",
    descEn: "Across the air gap. No vein crosses this gap — it is not a wound, it is a decision.",
    stack: ["vector store", "air-gapped"],
    node: { x: 60, y: 388, w: 160, h: 60 },
  },
]

// veins — 0°/45°/90° only · the main current + branches.
// `molten` is the ONE gradient in the whole site: the final approach into engine.decision.
// Its geometry is fixed here so the component can anchor a userSpaceOnUse gradient to it
// (object-bounding-box gradients vanish on axis-aligned lines — a lesson carved in stone).
export const MOLTEN = { x1: 540, y1: 190, x2: 660, y2: 130 } as const

export const VEINS: Array<{ d: string; from: string; kind: "main" | "branch" | "dark" | "molten" }> = [
  { d: "M0,260 H210", from: "iranoban", kind: "main" },
  { d: "M360,260 H480", from: "core", kind: "main" },
  { d: "M600,260 H730 L790,200 H910", from: "ask", kind: "main" },
  { d: "M1030,200 H1200", from: "ask", kind: "main" },
  { d: "M285,228 V164", from: "javdan", kind: "branch" },
  { d: "M540,292 V360 L600,420 H700", from: "db", kind: "branch" },
  { d: "M820,420 H950", from: "topics_memory", kind: "dark" },
  // the decision approach — 90° up, then 45°, entering the ember-framed chamber
  { d: "M540,228 V190", from: "engine.decision", kind: "branch" },
  { d: "M540,190 L600,130 H660", from: "engine.decision", kind: "molten" },
  // the quarantine stub — approaches ChromaDB, stops. the air gap stays visible.
  { d: "M150,388 V330", from: "chromadb", kind: "dark" },
]
