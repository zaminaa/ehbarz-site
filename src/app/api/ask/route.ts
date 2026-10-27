// /api/ask — the doorway to the real agent.
// Without ASK_ENDPOINT the honest answer is «نمی‌دانم» (state: absent).
// Below the confidence gate of 60 the answer is HELD, and the terminal says so.

import { NextResponse } from "next/server"
import { GATE } from "@/lib/confidence"

export const dynamic = "force-dynamic"

export type AskResult = {
  state: "answered" | "held" | "absent" | "error"
  answer: string | null
  confidence: number | null
}

export async function POST(req: Request) {
  let question = ""
  try {
    const body = (await req.json()) as { question?: unknown }
    if (typeof body.question === "string") question = body.question.trim().slice(0, 2000)
  } catch {
    /* fall through to the empty-question refusal */
  }
  if (!question) {
    return NextResponse.json<AskResult>({ state: "error", answer: null, confidence: null }, { status: 400 })
  }

  const endpoint = process.env.ASK_ENDPOINT
  if (!endpoint) {
    // the mind is not wired to this surface yet — say so, with dignity
    return NextResponse.json<AskResult>({ state: "absent", answer: null, confidence: null })
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.ASK_TOKEN ? { authorization: `Bearer ${process.env.ASK_TOKEN}` } : {}),
      },
      body: JSON.stringify({ question }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) {
      return NextResponse.json<AskResult>({ state: "error", answer: null, confidence: null }, { status: 502 })
    }
    const data = (await res.json()) as { answer?: unknown; confidence?: unknown }
    const answer = typeof data.answer === "string" ? data.answer : null
    const confidence = typeof data.confidence === "number" ? data.confidence : null

    // the gate — the agent's own uncertainty is honored, not hidden
    if (confidence !== null && confidence < GATE) {
      return NextResponse.json<AskResult>({ state: "held", answer: null, confidence })
    }
    if (answer === null) {
      return NextResponse.json<AskResult>({ state: "absent", answer: null, confidence })
    }
    return NextResponse.json<AskResult>({ state: "answered", answer, confidence })
  } catch {
    return NextResponse.json<AskResult>({ state: "error", answer: null, confidence: null }, { status: 504 })
  }
}
