import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router"
import { umamiWebsiteId } from "@/lib/analytics"
import { site } from "@/lib/links"
import appCss from "../styles.css?url"

const description =
  "A Chrome extension that rewrites the ChatGPT and Claude disclaimers — no hedging, one clown, and a gold shimmer."

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0b0a08" },
      { title: `${site.name} — ${site.tagline}` },
      { name: "description", content: description },
      { property: "og:title", content: `${site.name} — ${site.tagline}` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: site.url },
      { property: "og:image", content: `${site.url}/og.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${site.url}/og.png` },
    ],
    scripts: umamiWebsiteId
      ? [
          {
            src: "https://cloud.umami.is/script.js",
            defer: true,
            "data-website-id": umamiWebsiteId,
          },
        ]
      : [],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤡</text></svg>",
      },
    ],
  }),
  notFoundComponent: NotFound,
  component: Outlet,
  shellComponent: RootDocument,
})

function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="font-heading text-gold text-7xl">404</p>
      <p className="text-muted-foreground">This page can make mistakes too. It made one.</p>
      <a href="/" className="text-gold hover:text-gold-lit underline underline-offset-4">
        Back home
      </a>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
