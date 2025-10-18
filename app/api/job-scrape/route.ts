export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")
  if (!url) {
    return new Response(JSON.stringify({ error: "Missing url" }), { status: 400 })
  }
  try {
    const res = await fetch(url as string, { mode: "cors" })
    const html = await res.text()
    // naive extraction
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
    const title = titleMatch?.[1]?.trim()
    // JD extraction is site-dependent; attempt meta description
    const metaMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
    const jd = metaMatch?.[1] || ""
    return Response.json({ title, company: undefined, location: undefined, jd })
  } catch {
    // CORS likely; ask user to paste JD
    return Response.json({ title: undefined, company: undefined, location: undefined, jd: "" })
  }
}
