import { createFileRoute } from "@tanstack/react-router"
import { Download, Palette, Type, Zap } from "lucide-react"
import { ChatMock } from "@/components/chat-mock"
import { ChromeLogo } from "@/components/chrome-logo"
import { ComingSoon } from "@/components/coming-soon"
import { FlipWord } from "@/components/flip-word"
import { GithubMark } from "@/components/github-mark"
import { SiteFooter } from "@/components/site-footer"
import { track } from "@/lib/analytics"
import { links } from "@/lib/links"
import { models } from "@/lib/models"

export const Route = createFileRoute("/")({ component: Home })

const features = [
  {
    icon: Type,
    title: "No more hedging",
    body: "“ChatGPT can make mistakes” becomes “ChatGPT makes mistakes.” Claude and Gemini word it differently and get the same treatment. Grok ships no disclaimer at all, so it is handed one.",
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
  <>
    <a
      href={links.zip}
      onClick={() => track("download", { from: "steps" })}
      className="text-gold-lit hover:text-gold underline underline-offset-4"
    >
      Download makes-mistakes.zip
    </a>{" "}
    and unpack it.
  </>,
  <>
    Open <code className="text-foreground/80">chrome://extensions</code> and turn on Developer mode.
  </>,
  "Click Load unpacked and pick the unpacked folder.",
  "Reload any open ChatGPT, Claude, Gemini or Grok tab.",
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
              <FlipWord words={models} />{" "}
              <span className="text-muted-foreground/45 relative italic">
                can make
                <span className="bg-gold absolute inset-x-[-0.06em] top-[0.63em] h-[0.045em] -rotate-[0.6deg] rounded-full" />
              </span>
            </span>
            <span className="gilded sweep mt-1 block font-normal">makes mistakes.</span>
          </h1>

          <p className="rise text-muted-foreground mt-8 max-w-xl text-base leading-relaxed [animation-delay:160ms] sm:text-lg">
            A very small extension that drops the hedge from the footer disclaimer on ChatGPT,
            Claude, Gemini and Grok, gilds what's left, and hands you a button for when the answer
            is confidently wrong.
          </p>

          <div className="rise mt-10 flex flex-wrap items-center gap-4 [animation-delay:240ms]">
            {/* A white pill with the real Chrome mark — our own button, so it is round and
                sized to the page. Google's grey badge may not be restyled and is not used. */}
            {links.chromeWebStore ? (
              <a
                href={links.chromeWebStore}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("store")}
                className="inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 text-sm font-semibold text-[#202124] shadow-[0_6px_24px_-8px_rgba(0,0,0,0.7)] transition-colors hover:bg-white/90"
              >
                <ChromeLogo className="size-5" />
                Add to Chrome
              </a>
            ) : (
              <a
                href={links.zip}
                onClick={() => track("download", { from: "hero" })}
                className="bg-gold text-primary-foreground hover:bg-gold-lit inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-semibold shadow-[0_0_36px_-10px_var(--gold)] transition-colors"
              >
                <Download className="size-4.5" aria-hidden />
                Download .zip
              </a>
            )}

            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex h-12 items-center gap-2 px-2 text-sm transition-colors"
            >
              <GithubMark className="size-4" />
              Source
            </a>
          </div>

          <p className="rise text-muted-foreground/70 mt-5 text-xs [animation-delay:300ms]">
            {links.chromeWebStore ? (
              <>
                Or{" "}
                <a
                  href={links.zip}
                  onClick={() => track("download", { from: "hero" })}
                  className="decoration-gold/40 hover:text-gold underline underline-offset-4"
                >
                  download the .zip
                </a>{" "}
                and load it unpacked.
              </>
            ) : (
              "Not on the Chrome Web Store yet — grab the .zip and load it unpacked."
            )}
          </p>
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

        <ComingSoon />

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
              <li key={index} className="flex gap-4 text-sm leading-relaxed">
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
