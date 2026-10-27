import { NextResponse, type NextRequest } from "next/server"

// زبان میزبان، فارسی است. Persian is the host language; English is a first-class guest.
// The visitor's remembered choice is honored via cookie — middleware runs on the
// server and must never touch localStorage (it does not exist there).
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    const remembered = req.cookies.get("azarsang_lang")?.value
    const lang = remembered === "en" ? "en" : "fa"
    return NextResponse.redirect(new URL(`/${lang}`, req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ["/"] }
