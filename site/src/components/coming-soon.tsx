import { BookOpen, Flame, Languages, Scissors, SearchCheck, Sparkles, Zap } from "lucide-react"
import { WishlistForm } from "@/components/wishlist-form"

// The one that ships today, followed by what the paid version is meant to add.
const shipped = { icon: Zap, label: "Improve answer" }

const planned = [
  { icon: SearchCheck, label: "Fact-check it" },
  { icon: Scissors, label: "Make it shorter" },
  { icon: BookOpen, label: "Cite your sources" },
  { icon: Sparkles, label: "Explain simply" },
  { icon: Languages, label: "Translate" },
  { icon: Flame, label: "Roast this answer" },
]

export function ComingSoon() {
  return (
    <section className="py-20">
      <div className="grain relative overflow-hidden rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--gold)_28%,transparent)] bg-[#100e09]/70 px-6 py-10 sm:px-10 sm:py-12">
        <div className="relative">
          <p className="text-gold/70 text-[11px] tracking-[0.28em] uppercase">Coming soon</p>

          <h2 className="font-heading mt-4 max-w-lg text-3xl leading-tight sm:text-4xl">
            One button now. <span className="italic">A whole shelf of them</span> later.
          </h2>

          <p className="text-muted-foreground mt-4 max-w-xl text-sm leading-relaxed">
            The paid version turns this into a proper toolbar: a library of one-click prompts,
            buttons you write yourself, and different sets for ChatGPT and Claude. The free
            extension keeps doing what it does today — nothing gets taken away.
          </p>

          <ul className="mt-9 flex flex-wrap gap-2.5">
            <li className="border-gold/40 bg-gold/10 text-gold-lit inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] leading-none font-semibold">
              <shipped.icon className="size-3.5" aria-hidden />
              {shipped.label}
              <span className="text-gold/60 ml-1 text-[10px] font-normal tracking-wide uppercase">
                live
              </span>
            </li>

            {planned.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="text-muted-foreground/70 inline-flex items-center gap-1.5 rounded-full border border-dashed border-white/10 px-3.5 py-2 text-[12px] leading-none"
              >
                <Icon className="size-3.5" aria-hidden />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3">
            <WishlistForm />
            <p className="text-muted-foreground/70 max-w-md text-xs leading-relaxed">
              One email when the paid version is ready. Nothing else, and you can leave at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
