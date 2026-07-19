import { createFileRoute } from "@tanstack/react-router"

// Umami's own domains sit on every blocklist, and our audience installs browser
// extensions for fun — without this proxy we would lose most of the events.
const SCRIPT = "https://cloud.umami.is/script.js"
const COLLECT = "https://gateway.umami.is/api/send"

async function serveScript() {
  const upstream = await fetch(SCRIPT)

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  })
}

async function collect(request: Request) {
  // Umami derives country and device from these, so they have to survive the hop.
  const headers = new Headers({
    "content-type": request.headers.get("content-type") ?? "application/json",
    "user-agent": request.headers.get("user-agent") ?? "",
  })

  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) headers.set("x-forwarded-for", forwarded)

  const upstream = await fetch(COLLECT, {
    method: "POST",
    headers,
    body: await request.text(),
  })

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "text/plain" },
  })
}

async function handle({ request }: { request: Request }) {
  const { pathname } = new URL(request.url)

  if (pathname.endsWith("/script.js")) return serveScript()
  if (pathname.endsWith("/api/send")) return collect(request)

  return new Response("Not found", { status: 404 })
}

export const Route = createFileRoute("/stats/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
})
