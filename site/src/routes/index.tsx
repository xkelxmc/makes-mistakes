import { createFileRoute } from "@tanstack/react-router"
import { Download, Palette, Type, Zap } from "lucide-react"
import { ChatMock } from "@/components/chat-mock"
import { GithubMark } from "@/components/github-mark"
import { SiteFooter } from "@/components/site-footer"
import { links } from "@/lib/links"

export const Route = createFileRoute("/")({ component: Home })

const features = [
  {
    icon: Type,
    title: "No more hedging",
    body: "“ChatGPT can make mistakes” becomes “ChatGPT makes mistakes.” Claude's longer version gets the same treatment.",
  },
  {
    icon: Palette,
    title: "Gilded, not garish",
    body: "The line goes bold and a wide gold band glides across it slowly, once in a while. A highlight, not a spinner.",
  },
  {
    icon: Zap,
    title: "One-click disappointment",
    body: "An Improve answer button above the composer appends a firm reminder to double-check before answering.",
  },
]

const steps = [
  "Download the .zip from the latest release and unpack it.",
  "Open chrome://extensions and turn on Developer mode.",
  "Click Load unpacked and pick the unpacked folder.",
  "Reload any open ChatGPT or Claude tab.",
]

function Home() {
  return (
    <>
      <main className="mx-auto w-full max-w-4xl px-6">
        <section className="pt-24 pb-20 sm:pt-32">
          <p className="rise text-muted-foreground text-[11px] tracking-[0.28em] uppercase">
            Chrome extension
          </p>

          <h1 className="font-heading rise mt-6 text-[clamp(2.75rem,9vw,5.5rem)] leading-[1.04] tracking-tight [animation-delay:80ms]">
            {/* Reads correctly with the struck-out words ignored: "ChatGPT makes mistakes." */}
            <span className="block">
              ChatGPT{" "}
              <span className="text-muted-foreground/45 relative italic">
                can make
                <span className="bg-gold absolute inset-x-[-0.06em] top-[0.52em] h-[0.045em] -rotate-1 rounded-full" />
              </span>
            </span>
            <span className="gilded sweep mt-1 block font-normal">makes mistakes.</span>
          </h1>

          <p className="rise text-muted-foreground mt-8 max-w-xl text-base leading-relaxed [animation-delay:160ms] sm:text-lg">
            A very small extension that drops the hedge from the footer disclaimer on ChatGPT and
            Claude, gilds what's left, and hands you a button for when the answer is confidently
            wrong.
          </p>

          <div className="rise mt-10 flex flex-wrap items-center gap-4 [animation-delay:240ms]">
            {/* Google's branding guidelines: the badge is used unmodified, only resized,
                and may only link to a live Chrome Web Store listing. */}
            {links.chromeWebStore && (
              <a href={links.chromeWebStore} className="transition-opacity hover:opacity-85">
                <img
                  src="/chrome-web-store/badge-border-medium.png"
                  srcSet="/chrome-web-store/badge-border-medium.png 340w, /chrome-web-store/badge-border-large.png 496w"
                  alt="Available in the Chrome Web Store"
                  width={340}
                  height={96}
                  className="h-12 w-auto"
                />
              </a>
            )}

            <a
              href={links.releases}
              className="border-gold/40 text-gold-lit hover:border-gold hover:bg-gold/8 inline-flex h-11 items-center gap-2 rounded-full border px-6 text-sm font-medium transition-colors"
            >
              <Download className="size-4" aria-hidden />
              Download .zip
            </a>

            <a
              href={links.github}
              className="text-muted-foreground hover:text-foreground inline-flex h-11 items-center gap-2 px-2 text-sm transition-colors"
            >
              <GithubMark className="size-4" />
              Source
            </a>
          </div>

          {!links.chromeWebStore && (
            <p className="rise text-muted-foreground/70 mt-5 text-xs [animation-delay:300ms]">
              Not on the Chrome Web Store yet — grab the .zip and load it unpacked.
            </p>
          )}
        </section>

        <section className="pb-24">
          <ChatMock />
        </section>

        <div className="hairline" />

        <section className="grid gap-10 py-20 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, body }, index) => (
            <article key={title} className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="font-heading text-gold/50 text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="bg-gold/20 h-px flex-1" />
              </div>

              <Icon className="text-gold mt-6 size-9" strokeWidth={1.1} aria-hidden />
              <h2 className="font-heading mt-4 text-2xl leading-tight">{title}</h2>
              <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">{body}</p>
            </article>
          ))}
        </section>

        <div className="hairline" />

        <section className="grid gap-10 py-20 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <h2 className="font-heading text-3xl leading-tight">
              Install it <span className="italic">by hand</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Until the store listing goes live, loading it unpacked takes about a minute.
            </p>
          </div>

          <ol className="flex flex-col gap-4">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-4 text-sm leading-relaxed">
                <span className="border-gold/30 text-gold mt-0.5 flex size-6 flex-none items-center justify-center rounded-full border text-[11px]">
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
