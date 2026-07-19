import { Link, createFileRoute } from "@tanstack/react-router"
import { SiteFooter } from "@/components/site-footer"

export const Route = createFileRoute("/privacy")({ component: Privacy })

const sections = [
  {
    title: "What is collected",
    body: "Nothing. The extension has no analytics, no telemetry, no remote endpoint, and no account. It never sends a request anywhere.",
  },
  {
    title: "What is stored",
    body: "A single boolean — whether the button should flash once when it appears — kept in Chrome's own synced settings storage. It never leaves your Google account, and we cannot read it.",
  },
  {
    title: "What it can see",
    body: "The content script runs only on chatgpt.com, chat.openai.com and claude.ai. It reads the page text to find the disclaimer sentence and rewrites it. Your conversations are never copied, stored, or transmitted.",
  },
  {
    title: "Permissions",
    body: "Only `storage`, used for the setting above. No host permissions beyond the three sites listed in the manifest.",
  },
  {
    title: "Changes",
    body: "If this ever changes, it changes in public — the extension is open source and every version is tagged on GitHub.",
  },
]

function Privacy() {
  return (
    <>
      <main className="mx-auto w-full max-w-2xl px-6 pt-20 pb-16">
        <Link
          to="/"
          className="text-muted-foreground hover:text-gold text-xs tracking-[0.2em] uppercase transition-colors"
        >
          ← Makes Mistakes
        </Link>

        <h1 className="font-heading mt-8 text-5xl leading-tight">Privacy</h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Short version: the extension collects nothing, because it has nowhere to send it.
        </p>

        <div className="hairline my-10" />

        <div className="flex flex-col gap-9">
          {sections.map(({ title, body }) => (
            <section key={title}>
              <h2 className="font-heading text-gold-lit text-xl">{title}</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{body}</p>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
