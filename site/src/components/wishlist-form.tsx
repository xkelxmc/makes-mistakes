import { useState } from "react"
import { ArrowRight, LoaderCircle, MailCheck } from "lucide-react"
import { track } from "@/lib/analytics"
import { links } from "@/lib/links"

type State = "idle" | "sending" | "done" | "error"

// Kit can be slow; without a cap the button would spin forever on a dead network.
const TIMEOUT = 12_000

export function WishlistForm() {
  const [state, setState] = useState<State>("idle")
  const [email, setEmail] = useState("")

  // Without a form id there is nowhere to send anything, so fall back to the repo.
  if (!links.kitFormAction) {
    return (
      <a
        href={links.wishlist}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gold text-primary-foreground hover:bg-gold-lit inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors"
      >
        Join the wishlist
      </a>
    )
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    // Honeypot: real people never fill a hidden field, bots fill everything.
    if (data.get("website")) {
      setState("done")
      return
    }

    setState("sending")
    try {
      const response = await fetch(links.kitFormAction!, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
        signal: AbortSignal.timeout(TIMEOUT),
      })
      if (!response.ok) throw new Error(String(response.status))

      setState("done")
      setEmail("")
      track("wishlist")
    } catch {
      setState("error")
    }
  }

  // Kit runs double opt-in, so the address is not on the list until it is confirmed —
  // saying "you're in" here would be a lie and people would never open the email.
  if (state === "done") {
    return (
      <div className="border-gold/40 bg-gold/8 flex items-start gap-3 rounded-2xl border px-5 py-4">
        <MailCheck className="text-gold mt-0.5 size-5 flex-none" aria-hidden />
        <div>
          <p className="text-gold-lit text-sm font-semibold">Almost there.</p>
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            We sent you a confirmation link. Click it and you're on the list — otherwise this never
            happened.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="relative flex w-full max-w-lg flex-col gap-2">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <input
          type="email"
          name="email_address"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
          className="border-gold/30 focus:border-gold/70 placeholder:text-muted-foreground/60 h-11 min-w-0 flex-1 rounded-full border bg-black/40 px-5 text-sm transition-colors outline-none"
        />

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />

        {/* Stays lit while the field is empty — dimming the main call to action is the
            fastest way to make nobody notice it. Empty input is caught by `required`. */}
        <button
          type="submit"
          disabled={state === "sending"}
          className="bg-gold text-primary-foreground hover:bg-gold-lit inline-flex h-11 flex-none items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors disabled:cursor-default disabled:opacity-70"
        >
          {state === "sending" ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              Sending
            </>
          ) : (
            <>
              Join the wishlist
              <ArrowRight className="size-3.5" aria-hidden />
            </>
          )}
        </button>
      </div>

      {state === "error" && (
        <p className="ps-5 text-xs text-red-400/85">
          That didn't go through.{" "}
          <button type="submit" className="underline underline-offset-2">
            Try again
          </button>{" "}
          or{" "}
          <a
            href={links.issues}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            open an issue
          </a>
          .
        </p>
      )}
    </form>
  )
}
